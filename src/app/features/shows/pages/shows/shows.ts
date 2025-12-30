import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgClass, NgFor, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  of,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
  switchMap
} from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Movie } from '../../../../shared/model/movie';
import { ShowOut } from '../../../../shared/model/show';
import { ShowService } from '../../../../services/show-service';
import { Time12Pipe } from '../../../../shared/pipes/time12-pipe';
import { MovieDetailComponent } from '../../components/movie-details/movie-details';
import { ScreenService} from '../../../../services/screen-service';
import { Screen } from '../../../../shared/model/screen';
@Component({
  selector: 'app-shows',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgFor,
    NgClass,
    Time12Pipe,
    MovieDetailComponent,
    RouterModule
  ],
  templateUrl: './shows.html',
  styleUrls: ['./shows.css']
})
export class Shows {
  private router = inject(Router);
  private showService = inject(ShowService);
  private fb = inject(FormBuilder);
  private platformId = inject(PLATFORM_ID);
  private screenService = inject(ScreenService);
  private screens$: Observable<Screen[]> = this.screenService.getScreens();

  // Movie from router navigation state (browser-only, SSR-safe)
  readonly current_movie$: Observable<Movie | undefined> = of(this.getMovieFromNav()).pipe(
    shareReplay({ bufferSize: 1, refCount: false })
  );

  // Filters form
  readonly filterForm: FormGroup = this.fb.group({
    language: [''],
    format: ['']
  });

  // Date pills (7 days)
  readonly next7Days: Date[] = [];
  private readonly selectedDateSubject = new BehaviorSubject<Date | null>(this.todayLocalMidnight());
  readonly selectedDate$ = this.selectedDateSubject.asObservable();

  // Dropdown options for selected movie
  languageOptions: string[] = [];
  formatOptions: string[] = [];

  // Debounced + deduped form changes
  private readonly formChanges$ = this.filterForm.valueChanges.pipe(
    startWith(this.filterForm.value),
    debounceTime(150),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  );

  // Build filters payload; include only non-empty values
  private readonly filters$ = combineLatest([this.current_movie$, this.formChanges$, this.selectedDate$]).pipe(
    map(([movie, form, date]) => {
      const filters: Record<string, any> = {};
      if (movie?.movie_id) filters['movie_id'] = movie.movie_id;
      if (form.language) filters['language'] = form.language; // scalar string
      if (form.format) filters['format'] = form.format;       // scalar string
      if (date) filters['show_date'] = date.toLocaleDateString('en-CA'); // local YYYY-MM-DD
      return filters;
    }),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  // Fetch shows (latest wins)
  readonly shows$: Observable<ShowOut[]> = this.filters$.pipe(
    switchMap(filters => this.showService.getShows(filters)),
    map(shows => shows ?? []),
    shareReplay({ bufferSize: 1, refCount: false })
  );
  readonly groupedShows$ = combineLatest([
  this.shows$,
  this.screens$
]).pipe(
  map(([shows, screens]) => this.groupByScreen(shows,screens))
);

  constructor() {
    // Build date pills normalized to local midnight
    const base = this.todayLocalMidnight();
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      this.next7Days.push(d);
    }

    // Populate dropdown options for specific movie
    this.current_movie$.pipe(
      switchMap(movie => {
        if (!movie?.movie_id) {
          this.languageOptions = [];
          this.formatOptions = [];
          return of<ShowOut[]>([]);
        }
        return this.showService.getShows({ movie_id: movie.movie_id });
      })
    ).subscribe(shows => {
      const langs = new Set<string>();
      const fmts = new Set<string>();
      for (const s of shows ?? []) {
        if (s.language) langs.add(s.language);
        if (s.format) fmts.add(s.format);
      }
      this.languageOptions = Array.from(langs).sort();
      this.formatOptions = Array.from(fmts).sort();
    });
  }

  private getMovieFromNav(): Movie | undefined {
    if (!isPlatformBrowser(this.platformId)) return undefined;
    const nav = this.router.getCurrentNavigation();
    return nav?.extras?.state?.['data'] as Movie | undefined;
  }

  // Toggle: click same date to clear date filter (show all dates)
  selectDate(date: Date) {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    const cur = this.selectedDateSubject.value;
    if (cur && cur.toDateString() === normalized.toDateString()) {
      this.selectedDateSubject.next(null);
    } else {
      this.selectedDateSubject.next(normalized);
    }
  }

  DateString(date: any): string {
    return date?.toDateString?.() ?? '';
  }

groupByScreen(shows: ShowOut[], screens: Screen[]): { key: string; value: ShowOut[] }[] {
  // Create lookup: { screen_id → screen_name }
  const screenMap = new Map<number, string>(
    screens.map(s => [s.screen_id, s.screen_name])
  );

  const grouped: Record<string, ShowOut[]> = {};

  for (const s of shows) {
    const name = screenMap.get(s.screen_id) ?? 'Unknown Screen';
    (grouped[name] ??= []).push(s);
  }

  return Object.keys(grouped)
    .sort()  // alphabetical sort by screen_name
    .map(key => ({ key, value: grouped[key] }));
}


  trackByDate = (_: number, d: Date) => d.getTime();

  private todayLocalMidnight() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  gotoSeatmap(show: ShowOut) {
    console.log('Navigating to seatmap for show:');
    this.router.navigate(['/seats',show.show_id] );
  }
}