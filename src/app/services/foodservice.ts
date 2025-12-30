import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FoodCategory, FoodItem } from '../shared/model/food';

export interface FoodQuery {
  category_id?: number | null;
  search?: string | null;
  is_available?: boolean | null;
  skip?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class FoodService {
  private http = inject(HttpClient);

  // TODO: set your API origin
  private baseUrl = 'http://127.0.0.1:8000';

  getCategories(): Observable<FoodCategory[]> {
    // Adjust path if needed: e.g., /food/categories or /categories/food
    return this.http.get<FoodCategory[]>(`${this.baseUrl}/food-categories`);
  }

  getItems(q: FoodQuery = {}): Observable<FoodItem[]> {
    let params = new HttpParams();
    if (q.category_id) params = params.set('category_id', q.category_id);
    if (q.search) params = params.set('search', q.search);
    if (q.is_available != null) params = params.set('is_available', String(q.is_available));
    params = params
      .set('skip', String(q.skip ?? 0))
      .set('limit', String(q.limit ?? 100));
    return this.http.get<FoodItem[]>(`${this.baseUrl}/food-items`, { params });
  }
}