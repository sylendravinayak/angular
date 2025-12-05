import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShowOut } from '../shared/model/show';

@Injectable({ providedIn: 'root' })
export class ShowService {
  private base = 'http://localhost:8000/shows';

  constructor(private http: HttpClient) {}

  getShows(filters: any = {}, skip = 0, limit = 20): Observable<ShowOut[]> {
    let params = new HttpParams()
      .set('skip', skip)
      .set('limit', limit);

    const add = (key: string, val: any) => {
      if (val !== null && val !== undefined && val !== '') {
        params = params.set(key, val);
      }
    };

    add('movie_id', filters.movie_id);
    add('screen_id', filters.screen_id);
    add('status', filters.status);
    add('show_date', filters.show_date);
    add('language', filters.language);
    add('format', filters.format);
    add('price_min', filters.price_min);
    add('price_max', filters.price_max);
    add('preferred_time', filters.preferred_time);
    add('sort_by', filters.sort_by);

    // array fields
    if (Array.isArray(filters.special_formats) && filters.special_formats.length > 0) {
      add('special_formats', filters.special_formats.join(','));
    }

    return this.http.get<ShowOut[]>(`${this.base}/`, { params });
  }
}
