import { Component,OnInit, signal } from '@angular/core';
import { Card } from '../../shared/components/card/card';
import { MoviesService } from '../../services/movie_service';
import { Movie } from '../../shared/model/movie';
@Component({
  selector: 'app-recommended-movie',
  imports: [Card],
  templateUrl: './recommended-movie.html',
  styleUrl: './recommended-movie.css',
})
export class RecommendedMovie implements OnInit {

  movies = signal<Movie[]>([]);
  constructor(private moviesService: MoviesService) {}
  ngOnInit() {
    this.moviesService.getAll().subscribe(response => {
      this.movies.set(response.items);
      console.log(response.items);
    });
  }
}