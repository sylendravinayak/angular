import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap
} from 'rxjs';

import { FoodService } from '../../../../services/foodservice';
import { FoodCategory, FoodItem } from '../../../../shared/model/food';
import { BookingSummary } from '../../components/booking-summary/booking-summary';
import { BookingProgressBar } from '../../components/booking-progress-bar/booking-progress-bar';
import { Bookingstateservice } from '../../../../services/bookingstateservice';

@Component({
  selector: 'app-grab-food',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BookingSummary,
    BookingProgressBar
  ],
  templateUrl: './food-booking.page.html',
  styleUrls: ['./food-booking.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodComponent {

  private food = inject(FoodService);
  booking = inject(Bookingstateservice);   // used directly in template

  readonly searchCtrl = new FormControl<string>('', { nonNullable: true });

  private readonly category$ = new BehaviorSubject<number | null>(null);

  readonly categories$ = this.food.getCategories().pipe(
    map((cats: FoodCategory[]) =>
      cats.sort((a, b) => a.category_name.localeCompare(b.category_name))
    )
  );

  readonly items$ = combineLatest([
    this.category$,
    this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      debounceTime(250),
      distinctUntilChanged()
    )
  ]).pipe(
    switchMap(([category_id, search]) =>
      this.food.getItems({
        category_id: category_id ?? undefined,
        search: search?.trim() ? search.trim() : undefined,
        is_available: true,
        limit: 500
      })
    ),
    map(items => items ?? [])
  );

  setCategory(catId: number | null) {
    this.category$.next(catId);
  }

  trackByItem = (_: number, it: FoodItem) => it.food_id;

  qty(it: FoodItem) {
    return this.booking.getQty(it.food_id);
  }

  add(it: FoodItem) {
    this.booking.addItem(it);
  }

  dec(it: FoodItem) {
    this.booking.decreaseQuantity(it);
  }

  inc(it: FoodItem) {
    this.booking.addItem(it);
  }
}
