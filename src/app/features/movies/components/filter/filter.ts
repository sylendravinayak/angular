import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Movie } from '../../../../shared/model/movie';
import { NgClass ,CommonModule} from '@angular/common';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.html',
  imports: [NgClass, CommonModule]
  // styleUrls: ['./filter.css'] // keep or remove
})
export class FilterComponent implements OnChanges {

  @Input() movies: Movie[] = [];

  @Output() languagesChange = new EventEmitter<string[]>();
  @Output() genresChange = new EventEmitter<string[]>();
  @Output() formatsChange = new EventEmitter<string[]>();
  @Output() releaseDateFromChange = new EventEmitter<string | null>();
  @Output() sortByChange = new EventEmitter<{ field: string; order: 'asc' | 'desc' } | null>();

  languages: string[] = [];
  genres: string[] = [];
  formats: string[] = [];

  selectedLanguages = new Set<string>();
  selectedGenres = new Set<string>();
  selectedFormats = new Set<string>();

  releaseDateFrom: string | null = null;
  sortBy: { field: string; order: 'asc' | 'desc' } | null = null;

  // inside FilterComponent
parseSortValue(value: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value) as { field: string; order: 'asc' | 'desc' } | null;
  } catch {
    console.warn('Invalid sort value:', value);
    return null;
  }
}

json_stringify(value:any)
{
   return JSON.stringify(value);
}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movies']) {
      // Normalize fields and guard against undefined
      this.languages = Array.from(
        new Set(this.movies.flatMap(m => (m.language ? (Array.isArray((m as any).language) ? (m as any).language : [ (m as any).language ]) : [] ) as string[]))
      ).sort();

      this.genres = Array.from(new Set(this.movies.flatMap(m => m.genre ?? []))).sort();
      this.formats = Array.from(new Set(this.movies.flatMap(m => m.format ?? []))).sort();
    }
  }

  private emitAllSimple() {
    this.languagesChange.emit(Array.from(this.selectedLanguages));
    this.genresChange.emit(Array.from(this.selectedGenres));
    this.formatsChange.emit(Array.from(this.selectedFormats));
  }

  toggleLanguage(l: string) {
    if (this.selectedLanguages.has(l)) this.selectedLanguages.delete(l);
    else this.selectedLanguages.add(l);
    this.emitAllSimple();
  }

  toggleGenre(g: string) {
    if (this.selectedGenres.has(g)) this.selectedGenres.delete(g);
    else this.selectedGenres.add(g);
    this.emitAllSimple();
  }

  toggleFormat(f: string) {
    if (this.selectedFormats.has(f)) this.selectedFormats.delete(f);
    else this.selectedFormats.add(f);
    this.emitAllSimple();
  }


  clearLanguages() {
    this.selectedLanguages.clear();
    this.emitAllSimple();
  }
  clearGenres() {
    this.selectedGenres.clear();
    this.emitAllSimple();
  }
  clearFormats() {
    this.selectedFormats.clear();
    this.emitAllSimple();
  }

  onReleaseDateChange(value: string | null) {
    this.releaseDateFrom = value;
    this.releaseDateFromChange.emit(value);
  }

  onSortChange(value: { field: string; order: 'asc' | 'desc' } | null) {
    this.sortBy = value;
    this.sortByChange.emit(value);
  }
}