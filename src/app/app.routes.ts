import { Routes } from '@angular/router';
import { Home } from './features/home/pages/home.page/home';
import { MoviesPageComponent } from './features/movies/pages/movie.page/movie.page';
import { Shows } from './features/shows/pages/shows/shows';
import { SeatSelectorComponent } from './features/booking/pages/seat_booking/seat-booking.pages';
import { FoodComponent } from './features/booking/pages/food-booking/food-booking.page';
import { PaymentComponent } from './features/booking/pages/payment/payment.page';
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'movie', component: MoviesPageComponent },
  { path: 'shows', component: Shows },
  {path:'seats/:showId',component:SeatSelectorComponent},
  {path:'food',component:FoodComponent},
  {path:'payment',component:PaymentComponent}
];
