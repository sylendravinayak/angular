import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Screen } from '../shared/model/screen';

@Injectable({ providedIn: 'root' })
export class ScreenService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000'; // TODO: set to your API origin or environment.apiUrl

  getScreens(skip = 0, limit = 100, includeUnavailable = true): Observable<Screen[]> {
    let params = new HttpParams()
      .set('skip', skip)
      .set('limit', limit);
    if (!includeUnavailable) {
      params = params.set('is_available', true);
    }
    return this.http.get<Screen[]>(`${this.baseUrl}/screens/`, { params });
  }

  getScreen(screenId: number): Observable<Screen> {
    return this.http.get<Screen>(`${this.baseUrl}/screens/${screenId}`);
  }

  createScreen(payload: Omit<Screen, 'screen_id'>): Observable<Screen> {
    return this.http.post<Screen>(`${this.baseUrl}/screens/`, payload);
  }

  updateScreen(screenId: number, patch: Partial<Omit<Screen, 'screen_id'>>): Observable<Screen> {
    return this.http.patch<Screen>(`${this.baseUrl}/screens/${screenId}`, patch);
  }

  toggleAvailability(screenId: number, is_available: boolean): Observable<Screen> {
    return this.updateScreen(screenId, { is_available });
  }
}