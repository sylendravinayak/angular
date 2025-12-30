import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SeatOut } from '../services/seatmap-service';
/**
 * Local seat shape used by the component.
 * We normalize backend response into this shape.
 */


@Injectable({ providedIn: 'root' })
export class SeatService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000'; // change to your API origin or environment variable

  /**
   * Fetch seats for a show.
   * Backend returns { seat_categories: [ { category_id, category_name, price, seats: [...] } ], screen, booked_seat_ids, ... }
   * We flatten that into SeatOut[] including category_name and price per seat.
   */
  getSeatsForShow(showId: number): Observable<SeatOut[]> {
    return this.http.get<any>(`${this.baseUrl}/shows/seats/${showId}`).pipe(
      map(res => {
        if (!res) return [];
        const screenId = res.screen?.screen_id;
        const seatCategories = res.seat_categories ?? [];
        const seats: SeatOut[] = [];
        for (const cat of seatCategories) {
          const category_id = cat.category_id;
          const category_name = cat.category_name;
          const price = cat.price;
          for (const s of cat.seats ?? []) {
            seats.push({
              seat_id: s.seat_id,
              screen_id: screenId,
              row_number: s.row ?? s.row_number ?? 0,
              col_number: s.col ?? s.col_number ?? 0,
              category_id,
              seat_number: s.seat_no ?? s.seat_number ?? undefined,
              is_available: !!s.available,
              category_name,
              price
            });
          }
        }
        return seats;
      })
    );
  }
}