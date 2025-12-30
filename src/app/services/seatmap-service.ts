import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ShowSeatResponse {
  show_id: number;
  show_date: string;
  show_time: string;
  movie: { movie_id: number; title: string; poster_url?: string };
  screen: { screen_id: number; screen_name: string };
  seat_categories: Array<{
    category_id: number;
    category_name: string;
    price?: number;
    seats: Array<{
      seat_id: number;
      seat_no: string | null;
      row: number;
      col: number;
      available: boolean;
    }>;
  }>;
  booked_seat_ids: number[];
}

export interface SeatOut {
  seat_id: number;
  screen_id: number;
  row_number: number;
  col_number: number;
  category_id: number;
  seat_number?: string;
  is_available: boolean;
  category_name?: string;
  price?: number;
}

@Injectable({ providedIn: 'root' })
export class ShowSeatService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000';

  getSeatsForShow(showId: number): Observable<{ seats: SeatOut[]; screen_id: number; screen_name: string, show_date: string ,show_time: string,movie_title:string,movie_poster:string}> {
    return this.http.get<ShowSeatResponse>(`${this.baseUrl}/shows/seats/${showId}`).pipe(
      map(resp => {
        const seats: SeatOut[] = [];
        for (const cat of resp.seat_categories ?? []) {
          for (const s of cat.seats ?? []) {
            seats.push({
              seat_id: s.seat_id,
              screen_id: resp.screen?.screen_id ?? 0,
              row_number: s.row,
              col_number: s.col,
              category_id: cat.category_id,
              seat_number: s.seat_no ?? undefined,
              is_available: s.available,
              category_name: cat.category_name,
              price: cat.price
            });
          }
        }
        return {
          seats,
          screen_id: resp.screen?.screen_id ?? 0,
          screen_name: resp.screen?.screen_name ?? '',
          show_date: resp.show_date,
          show_time: resp.show_time,
          movie_title: resp.movie?.title ?? '',
          movie_poster: resp.movie?.poster_url ?? ''
        };
      })
    );
  }
}