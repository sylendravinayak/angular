import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../layout/navbar/navbar';
import { FilterComponent } from '../../../shared/components/filter/filter';
import { NowShowingComponent } from '../../../shared/components/nowshowing/nowshowing';
import { MoviesService, MoviesResponse } from '../../../services/movie_service';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  Observable,
} from 'rxjs';
import { Movie } from '../../../shared/model/movie';

@Component({
  selector: 'app-movies-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FilterComponent, NowShowingComponent],
  templateUrl: './movie.html',
})
export class MoviesPageComponent {
  // snapshot used to provide facets to FilterComponent (load many items once)
  moviesSnapshot: Movie[] = [];

  // response & items stream from server for current filters/paging
  moviesResponse$!: Observable<MoviesResponse>;
  movies$!: Observable<Movie[]>;

  // subjects for UI inputs
  private search$ = new BehaviorSubject<string>('');
  private languages$ = new BehaviorSubject<string[]>([]);
  private genres$ = new BehaviorSubject<string[]>([]);
  private formats$ = new BehaviorSubject<string[]>([]);
  private releaseDate$ = new BehaviorSubject<string | null>(null);
  private sortBy$ = new BehaviorSubject<{ field: string; order: 'asc' | 'desc' } | null>(null);
  private page$ = new BehaviorSubject<number>(0);
  private pageSize$ = new BehaviorSubject<number>(10);

  // expose current page items to the template
  pageItems$!: Observable<Movie[]>;

  // track current page for template controls (kept in sync with page$)
  currentPage = 0;

  constructor(private moviesService: MoviesService) {
    // load a snapshot of movies for facet building (adjust limit as needed)
    this.moviesService.getAll({ skip: 0, limit: 200 }).subscribe({
      next: (r) => (this.moviesSnapshot = r.items || []),
      error: (err) => console.error(err),
    });

    // whenever filters change, request server with options
    this.moviesResponse$ = combineLatest([
      this.search$.pipe(startWith(''), debounceTime(250), distinctUntilChanged()),
      this.languages$.pipe(startWith([] as string[])),
      this.genres$.pipe(startWith([] as string[])),
      this.formats$.pipe(startWith([] as string[])),
      this.releaseDate$.pipe(startWith(null)),
      this.sortBy$.pipe(startWith(null)),
      this.page$.pipe(startWith(0)),
      this.pageSize$.pipe(startWith(10)),
    ]).pipe(
      // small debounce so rapid UI changes don't flood server
      debounceTime(150),
      switchMap(([q, langs, gens, fmts, releaseFrom, sortBy, page, pageSize]) => {
        const skip = page * pageSize;
        // keep local currentPage in sync
        this.currentPage = page;
        return this.moviesService.getAll({
          skip,
          limit: pageSize,
          languages: langs,
          genres: gens,
          formats: fmts,
          releaseDateFrom: releaseFrom ?? undefined,
          sortBy: sortBy ?? undefined,
        });
      })
    );

    this.movies$ = this.moviesResponse$.pipe(map((r) => r.items || []));
    this.pageItems$ = this.movies$;
  }

  // child event handlers
  // normalize incoming value to a string (handles string | Event | { target: { value } })
  onSearch(event: unknown) {
    let value = '';
    if (typeof event === 'string') {
      value = event;
    } else if (event && typeof event === 'object') {
      const anyEvent = event as any;
      if (anyEvent?.target && anyEvent.target.value != null) {
        value = String(anyEvent.target.value);
      } else if (anyEvent?.detail != null) {
        value = String(anyEvent.detail);
      } else if (anyEvent?.value != null) {
        value = String(anyEvent.value);
      } else {
        value = '';
      }
    }
    this.search$.next(value ?? '');
  }

  onLanguages(arr: string[]) {
    this.languages$.next(arr);
  }
  onGenres(arr: string[]) {
    this.genres$.next(arr);
  }
  onFormats(arr: string[]) {
    this.formats$.next(arr);
  }
  onReleaseDateFrom(d: string | null) {
    this.releaseDate$.next(d);
  }
  onSortBy(s: { field: string; order: 'asc' | 'desc' } | null) {
    this.sortBy$.next(s);
  }

  // pagination helpers
  goToPage(p: number) {
    const page = Math.max(0, Math.floor(Number(p) || 0));
    this.currentPage = page;
    this.page$.next(page);
  }

  // refresh current page (re-request server)
  refresh() {
    this.page$.next(this.currentPage);
  }

  setPageSize(n: number | string) {
    const size = Number(n) || 10;
    this.pageSize$.next(size);
    // reset to first page after page size change
    this.goToPage(0);
  }
}