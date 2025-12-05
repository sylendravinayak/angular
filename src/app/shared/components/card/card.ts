import { Component,input } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Movie } from '../../model/movie';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-card',
  imports: [NgStyle,RouterModule],
  templateUrl: './card.html',
  styleUrls: ['./card.css'],
})
export class Card {
  movie=input<Movie>();
  constructor(private router: Router) {}
  navigateToDetails() {
    this.router.navigate(['/shows'], { state: { data: this.movie() } });
  }
}
