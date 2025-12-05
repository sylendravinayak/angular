import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Movie } from './../shared/model/movie';

export interface MoviesResponse {
  items: Movie[];
  total?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  // include trailing slash to match your backend url if you want
  private base = 'http://localhost:8000/movies/';

  constructor(private http: HttpClient) {}

  getAll(options?: {
    skip?: number;
    limit?: number;
    languages?: string[];
    genres?: string[];
    formats?: string[];
    releaseDateFrom?: string;
    sortBy?: { field: string; order: 'asc' | 'desc' } | null;
  }): Observable<MoviesResponse> {
    let params = new HttpParams();

    if (options?.skip != null) params = params.set('skip', String(options.skip));
    if (options?.limit != null) params = params.set('limit', String(options.limit));

    (options?.languages ?? []).forEach(l => (params = params.append('language', l)));
    (options?.genres ?? []).forEach(g => (params = params.append('genre', g)));
    (options?.formats ?? []).forEach(f => (params = params.append('format', f)));

    if (options?.releaseDateFrom) params = params.set('release_date_from', options.releaseDateFrom);
    if (options?.sortBy) params = params.set('sort_by', JSON.stringify(options.sortBy));

    console.debug('[MoviesService] GET', this.base, 'params:', params.toString());

    // request as any so we can inspect the raw shape
    return this.http.get<any>(this.base, { params }).pipe(
      tap(raw => console.debug('[MoviesService] raw response (first 300 chars):', 
        typeof raw === 'string' ? raw.slice(0, 300) : JSON.stringify(raw).slice(0, 300))),
      map(raw => {
        // If backend returns a raw array -> wrap into { items }
        if (Array.isArray(raw)) {
          return { items: raw as Movie[] } as MoviesResponse;
        }

        // If backend returns { items: [...] } -> use it
        if (raw && Array.isArray(raw.items)) {
          return { items: raw.items as Movie[], total: raw.total } as MoviesResponse;
        }

        // If backend uses a different envelope (e.g., {"data": [...]}) adapt here
        // Quickly try a few common variants:
        if (raw && Array.isArray(raw.data)) {
          return { items: raw.data as Movie[], total: (raw.total ?? raw.count) } as MoviesResponse;
        }

        // fallback: if it's an object with stringified items
        console.warn('[MoviesService] unexpected response shape, returning empty items', raw);
        return { items: [] } as MoviesResponse;
      }),
      catchError(err => {
        console.error('[MoviesService] request failed', err);
        return throwError(() => err);
      })
    );
  }
}