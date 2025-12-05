import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../../../services/movie_service';
import { Movie } from '../../model/movie';
import { Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-details.html',
})
export class MovieDetailComponent {
  // Expose an observable that the template can async-pipe
  @Input() movie$!: Observable<Movie | null>;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private moviesService: MoviesService
  ) {
    // Try navigation state first (fast when coming from a card)
    const nav = this.router.getCurrentNavigation();
    const stateMovie = nav?.extras?.state?.['data'] as Movie | undefined;

    
  }

  // Template action handlers
  bookTickets(movie: Movie | null) {
    if (!movie) return;
    // navigate to booking flow / show modal
    console.log('Book tickets for', movie.movie_id);
    // e.g. this.router.navigate(['/booking', movie.id]);
  }

  share(movie: Movie | null) {
    if (!movie) return;
    if ((navigator as any).share) {
      (navigator as any).share({
        title: movie.title,
        text: `Check out ${movie.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      // show a toast/snackbar that URL was copied
    }
  }
}