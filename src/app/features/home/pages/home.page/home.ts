import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../layout/navbar/navbar';
import { Appcarosel } from '../../components/appcarosel/appcarosel';
import { Card } from '../../../../shared/components/card/card';
import {RecommendedMovie} from '../../components/recommended-movie/recommended-movie';
@Component({
  selector: 'app-home',
  imports: [NavbarComponent, Appcarosel, Card, RecommendedMovie],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class Home {

}
