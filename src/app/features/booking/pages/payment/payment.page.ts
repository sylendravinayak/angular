import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BookingProgressBar } from '../../components/booking-progress-bar/booking-progress-bar';
import { BookingSummary } from '../../components/booking-summary/booking-summary';
import { Bookingstateservice } from '../../../../services/bookingstateservice';
import { CouponService, CouponValidateRequest } from '../../../../services/couponservices';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BookingProgressBar, BookingSummary],
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private coupons = inject(CouponService);
  booking = inject(Bookingstateservice);

  paymentMethod: 'card_credit' | 'card_debit' | 'upi' = 'card_credit';
  readonly GST_RATE = 0.18;

  applying = false;
  couponApplied = '';
  couponError = '';

  cardForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    number: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
    save: [true]
  });

  upiForm = this.fb.group({
    upiId: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/)]]
  });

  seats() { return this.booking.selected?.() ?? []; }
  cart() { return this.booking.cart?.() ?? []; }

  ticketSubtotal(): number {
    return this.seats().reduce((sum: number, s: any) => sum + Number(s.price ?? 0), 0);
  }

  foodSubtotal(): number {
    return this.cart().reduce((sum: number, item: any) =>
      sum + Number(item.price ?? 0) * Number(item.quantity ?? 0), 0);
  }

  subtotal(): number {
    return this.ticketSubtotal() + this.foodSubtotal();
  }

  removeCoupon() {
    this.booking.discount?.set?.(0);
    this.couponApplied = '';
    this.couponError = '';
  }

  applyCoupon(codeRaw: string) {
    this.applying = true;
    const code = codeRaw;
    const amount = this.subtotal();

    const req: CouponValidateRequest = { code, amount };

    this.coupons.validateCoupon(req).subscribe({
      next: (resp) => {
        // FIXED → backend returns `isvalid`, not `is_valid`
        if (resp.isvalid && resp.discount_amount) {
          this.booking.discount?.set?.(resp.discount_amount);
          this.couponApplied = code;
          this.couponError = '';
        } else {
          this.booking.discount?.set?.(0);
          this.couponApplied = '';
          this.couponError = 'Invalid or expired coupon';
        }
      },

      error: (err) => {
        this.booking.discount?.set?.(0);
        this.couponApplied = '';
        this.couponError = err.error?.detail || 'Invalid or expired coupon';
      },

      complete: () => {
        this.applying = false;
      }
    });
  }

  discount(): number {
    return this.booking.discount?.() ?? 0;
  }

  taxableTotal(): number {
    return Math.max(0, this.subtotal() - this.discount());
  }

  gst(): number {
    return this.round2(this.taxableTotal() * this.GST_RATE);
  }

  payable(): number {
    return this.round2(this.taxableTotal() + this.gst());
  }

  round2(n: number) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }

  payNow() {
    if (this.paymentMethod === 'upi') {
      if (this.upiForm.invalid) {
        this.upiForm.markAllAsTouched();
        return;
      }
    } else {
      if (this.cardForm.invalid) {
        this.cardForm.markAllAsTouched();
        return;
      }
    }

    this.booking.currentStep?.set?.(3);

    console.log('Payment submitted', {
      method: this.paymentMethod,
      amount: this.payable(),
      seats: this.seats(),
      cart: this.cart(),
      coupon: this.couponApplied
    });

    this.router.navigate(['/']);
  }
}
