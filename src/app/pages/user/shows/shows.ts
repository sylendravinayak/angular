import { Component } from '@angular/core';
import { MovieDetailComponent } from '../../../shared/components/movie-details/movie-details';
import { Router } from '@angular/router';
import { Movie } from '../../../shared/model/movie';
import { Observable, of, take } from 'rxjs';
import { ShowFilter } from '../../../shared/components/show-filter/show-filter';
import { ShowService } from '../../../services/show-service';
import { ShowOut } from '../../../shared/model/show';
import { NgFor, KeyValuePipe } from '@angular/common';
import { Time12Pipe } from '../../../shared/pipes/time12-pipe';

@Component({
  selector: 'app-shows',
  standalone: true,
  imports: [
    MovieDetailComponent,
    ShowFilter,
    NgFor,
    KeyValuePipe,
    Time12Pipe
  ],
  templateUrl: './shows.html',
  styleUrl: './shows.css'
})
export class Shows {

  current_movie$!: Observable<Movie>;
  groupedScreens: { [screen: string]: ShowOut[] } = {};

  constructor(
    private router: Router,
    private showService: ShowService
  ) {
    const nav = this.router.getCurrentNavigation();
    const movie = nav?.extras.state?.['data'] as Movie;
    this.current_movie$ = of(movie);
  }

  onFiltersChanged(filters: any) {
    this.current_movie$.pipe(take(1)).subscribe(movie => {
      const finalFilters = {
        ...filters,
        movie_id: movie.movie_id
      };

      this.showService.getShows(finalFilters).subscribe(shows => {
        this.groupByScreen(shows);
      });
    });
  }

  private groupByScreen(shows: ShowOut[]) {
    this.groupedScreens = {};

    for (const s of shows) {
      const key = s.screen_id || 'Unknown Screen';
      if (!this.groupedScreens[key]) {
        this.groupedScreens[key] = [];
      }
      this.groupedScreens[key].push(s);
    }
  }
}
