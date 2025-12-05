import { Routes } from '@angular/router';
import { Home } from './pages/user/home/home';
import { MoviesPageComponent } from './pages/user/movie/movie';
import { Shows } from './pages/user/shows/shows';
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'movie', component: MoviesPageComponent },
  { path: 'shows', component: Shows }
];
