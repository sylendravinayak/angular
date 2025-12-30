import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { Bookingstateservice } from '../../../../services/bookingstateservice';
@Component({
  selector: 'app-booking-progress-bar',
  imports: [NgClass],
  templateUrl: './booking-progress-bar.html',
  styleUrl: './booking-progress-bar.css',
})
export class BookingProgressBar {
  constructor(public bookingStateService: Bookingstateservice) {}
}
