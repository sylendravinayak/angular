import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Time12Pipe } from '../../../../shared/pipes/time12-pipe';
import { ShowSeatService} from '../../../../services/seatmap-service';
import { BookingProgressBar } from '../../components/booking-progress-bar/booking-progress-bar';
import { Bookingstateservice } from '../../../../services/bookingstateservice';
import { BookingSummary } from '../../components/booking-summary/booking-summary';
import { SeatOut } from '../../../../services/seatmap-service';
import { Route } from '@angular/router';
import { ShowSummary } from '../../../../shared/model/show';

interface GroupedSeats {
  category: string;
  price?: number;
  rows: Array<{ rowLabel: string; seats: SeatOut[] }>;
}

@Component({
  selector: 'app-seat-selector',
  standalone: true,
  imports: [CommonModule, Time12Pipe, BookingProgressBar, BookingSummary],
  templateUrl: './seat-booking.pages.html',
  styleUrls: ['./seat-booking.page.css']
})
export class SeatSelectorComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private showSeatService = inject(ShowSeatService);
  private bookingStateService = inject(Bookingstateservice);
  screenId = 0;
  maxSelectable = 10;
  
  seats$ = new BehaviorSubject<SeatOut[]>([]);
  grouped: GroupedSeats[] = [];
  

  // Lightweight summary derived from seat API (since navigation state may be absent on reload)
  showSummary = this.bookingStateService.showSummary;

  constructor(private cdr: ChangeDetectorRef) {}
 

  ngOnInit() {
    this.bookingStateService.currentStep.set(1);
    const showIdParam = this.route.snapshot.paramMap.get('showId');
    if (!showIdParam) {
      console.error('SeatSelector: showId route param missing. Ensure route is seats/:showId and navigate with the ID.');
      return;
    }
    const showId = +showIdParam;
    this.fetchSeatsForShow(showId);
  }

  fetchSeatsForShow(showId: number) {
    this.showSeatService.getSeatsForShow(showId).subscribe(({ seats, screen_id, screen_name, show_date, show_time,movie_title,movie_poster }) => {
      console.log('SeatSelector: fetched seats count =', seats?.length);
      this.screenId = screen_id;
      const prev = this.bookingStateService.showSummary() ?? {};
      this.bookingStateService.showSummary.set({
        ...prev,
        screen_name,
        show_date,
        show_time,
        movie_title,
        movie_poster
});
      this.seats$.next(seats ?? []);
      this.grouped = this.groupByCategoryAndRow(seats ?? []);
      console.log('SeatSelector: grouped sections =', this.grouped.length);
      console.log('SeatSelector: show summary =', this.showSummary);
      this.cdr.detectChanges();
    });
  }



  groupByCategoryAndRow(seats: SeatOut[]): GroupedSeats[] {
    const categoryMap = new Map<number, { name: string; price?: number; rows: Map<number, SeatOut[]> }>();

    for (const s of seats) {
      const catKey = s.category_id ?? 0;
      if (!categoryMap.has(catKey)) {
        categoryMap.set(catKey, {
          name: s.category_name || 'CLASSIC',
          price: s.price,
          rows: new Map<number, SeatOut[]>()
        });
      }
      const cat = categoryMap.get(catKey)!;
      const row = s.row_number ?? 0;
      if (!cat.rows.has(row)) cat.rows.set(row, []);
      cat.rows.get(row)!.push(s);
    }

    const result: GroupedSeats[] = [];
    categoryMap.forEach(cat => {
      const rows = Array.from(cat.rows.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([rowNum, seats]) => ({
          rowLabel: this.rowLabel(rowNum),
          seats: seats.sort((a, b) => a.col_number - b.col_number)
        }));
      result.push({
        category: cat.name,
        price: cat.price,
        rows
      });
    });

    return result;
  }

  rowLabel(rowNumber: number) {
    return String.fromCharCode(64 + rowNumber); // 1->A, 2->B...
  }

  isSelected(seat: SeatOut) {
    return this.bookingStateService.selected().some(sel => sel.seat_id === seat.seat_id);
  }

 toggleSeat(seat: SeatOut) {
  if (!seat.is_available) return;

  const selectedSig = this.bookingStateService.selected;
  const current = selectedSig();
  const idx = current.findIndex(sel => sel.seat_id === seat.seat_id);

  if (idx >= 0) {
    // Remove seat
    selectedSig.update(list => list.filter(s => s.seat_id !== seat.seat_id));
  } else {
    // Add seat (only if limit not reached)
    if (current.length >= this.maxSelectable) return;

    selectedSig.update(list => [...list, seat]);
  }
}

}