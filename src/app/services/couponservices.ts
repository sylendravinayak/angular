import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CouponValidateRequest {
  code: string;
  amount: number;
  movie_id?: number;
  show_id?: number;
  // add show_id, user_id etc. if needed by backend
}

export interface CouponValidateResponse {
  isvalid: boolean;
  discount_amount: number;
}

@Injectable({ providedIn: 'root' })
export class CouponService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000';

 validateCoupon(payload: CouponValidateRequest): Observable<CouponValidateResponse> {
 return this.http.post<CouponValidateResponse>(
  `${this.baseUrl}/discounts/validate`,
  {},
  { params: { code: payload.code, amount: payload.amount } }
);

}

}