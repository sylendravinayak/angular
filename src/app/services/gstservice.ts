import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Gstservice {
private http: HttpClient;
private baseUrl = 'http://localhost:8000';

  constructor(http: HttpClient) {
    this.http = http;
  }
  getGstRate(): Observable<{ gst_rate: number }> {
    return this.http.get<{ gst_rate: number }>(`${this.baseUrl}/gst/rate`);
  }

}
