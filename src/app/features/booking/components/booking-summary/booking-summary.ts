import { DatePipe, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Time12Pipe } from '../../../../shared/pipes/time12-pipe';
import { Bookingstateservice } from '../../../../services/bookingstateservice';
import { Router } from '@angular/router';
import { Gstservice } from '../../../../services/gstservice';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [DatePipe, Time12Pipe, NgIf, NgFor, DecimalPipe],
  templateUrl: './booking-summary.html',
  styleUrls: ['./booking-summary.css'],
})
export class BookingSummary {
  
  bookingStateService = inject(Bookingstateservice);
  router = inject(Router);
  gstservice =inject(Gstservice)
  showSummary = this.bookingStateService.showSummary;

  // ✅ IMPORTANT: expose cart signal from the service
  cart = this.bookingStateService.cart;
  
  totalPrice() {
    return this.bookingStateService.selected().reduce(
      (sum, seat) => sum + (seat.price || 0),
      0
    );
  }

  // ✅ Total food amount
  foodTotal() {
    return this.cart().reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
  }

  rowLabel(rowNumber: number) {
    return String.fromCharCode(64 + rowNumber);
  }

  proceed() {
    if (this.bookingStateService.selected().length === 0) return;

    const step = this.bookingStateService.currentStep();
    if (step === 1) {
      this.bookingStateService.currentStep.set(2);
      this.router.navigateByUrl('/food');
    } else if (step === 2) {
      this.bookingStateService.currentStep.set(3);
      this.router.navigateByUrl('/payment');
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
