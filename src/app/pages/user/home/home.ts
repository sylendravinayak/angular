import { Component } from '@angular/core';
import { NavbarComponent } from '../../../layout/navbar/navbar';
import { Appcarosel } from '../../../shared/components/appcarosel/appcarosel';
import { Card } from '../../../shared/components/card/card';
import {RecommendedMovie} from '../../../layout/recommended-movie/recommended-movie';
@Component({
  selector: 'app-home',
  imports: [NavbarComponent, Appcarosel, Card, RecommendedMovie],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
