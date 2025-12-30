import { Injectable, signal, WritableSignal } from '@angular/core';
import { Signal } from '@angular/core';
import { SeatOut } from '../services/seatmap-service';
import { ShowSummary } from '../shared/model/show';
import { FoodItem } from '../shared/model/food';


export interface CartItem extends FoodItem {
  quantity: number;
}


@Injectable({
  providedIn: 'root',
})
export class Bookingstateservice {
  currentStep  = signal(1);
  selected = signal<SeatOut[]>([]);
  showSummary = signal<ShowSummary | null>(null);
  cart = signal<CartItem[]>([]);
  discount = signal<number>(0);

  // Getter → Always returns latest value
  get items() {
    return this.cart();
  }

  // Getter → Derived value (alternative for computed)
  get totalQuantity() {
    return this.cart().reduce((sum, item) => sum + item.quantity, 0);
  }

    getQty(id: number): number {
    return this.cart().find(i => i.food_id === id)?.quantity ?? 0;
  }
  // Add an item or increase quantity
  addItem(product: FoodItem) {
    this.cart.update(current => {
      const existing = current.find(i => i.food_id === product.food_id);

      if (existing) {
        // Increase quantity
        return current.map(i =>
          i.food_id === product.food_id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      // Add new item
      return [...current, { ...product, quantity: 1 }];
    });
  }

  // Decrease quantity or remove item
  decreaseQuantity(item: FoodItem) {
    this.cart.update(current =>
      current
        .map(i =>
          i.food_id === item.food_id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter(i => i.quantity > 0)
    );
  }

  // Clear all items
  clearCart() {
    this.cart.set([]);
  }
}
