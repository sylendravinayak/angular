import { Component, EventEmitter, Output } from '@angular/core';
import { DatePipe, NgClass, NgFor } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShowService } from '../../../services/show-service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-show-filter',
  standalone: true,
  imports: [NgClass, NgFor, ReactiveFormsModule,DatePipe],
  templateUrl: './show-filter.html',
  styleUrls: ['./show-filter.css']
})
export class ShowFilter {
  // For template comparisons
  DateString(date: any): string {
    return date?.toDateString?.() ?? '';
  }

  @Output() filtersChanged = new EventEmitter<{
    language: string | null;
    format: string | null;
    show_date: string | null;
  }>();

  filterForm: FormGroup;
  next7Days: Date[] = [];
  selectedDate: Date | null = new Date();

  languageOptions: string[] = [];
  formatOptions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private showService: ShowService
  ) {
    this.filterForm = this.fb.group({
      language: [''],
      format: ['']
    });

    // Debounce and dedupe form changes
    this.filterForm.valueChanges
      .pipe(
        debounceTime(150),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe(() => this.emitFilters());

    // Populate dropdowns (defensively include both scalar and array forms)
    this.showService.getShows().subscribe(shows => {
      const langs = new Set<string>();
      const fmts = new Set<string>();
      for (const s of shows || []) {
        const lArr = Array.isArray(s.language) ? s.language : (s.language ? [s.language] : []);
        const fArr = Array.isArray(s.format) ? s.format : (s.format ? [s.format] : []);
        lArr.forEach(v => v && langs.add(v));
        fArr.forEach(v => v && fmts.add(v));
      }
      this.languageOptions = Array.from(langs);
      this.formatOptions = Array.from(fmts);
    });

    // Build next 7 days normalized to local midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      this.next7Days.push(d);
    }

    // Emit initial filters so parent fetches immediately
    this.emitFilters();
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.emitFilters();
  }

  private emitFilters() {
    const values = this.filterForm.value;
    const showDate = this.selectedDate
      // Local YYYY-MM-DD without timezone shift
      ? this.selectedDate.toLocaleDateString('en-CA')
      : null;

    this.filtersChanged.emit({
      language: values.language || null,
      format: values.format || null,
      show_date: showDate
    });
  }
}