import { Component, EventEmitter, Output } from '@angular/core';
import { NgClass, NgFor, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShowService } from '../../../services/show-service';
import { ShowOut } from '../../model/show';

@Component({
  selector: 'app-show-filter',
  standalone: true,
  imports: [NgClass, NgFor, ReactiveFormsModule, DatePipe],
  templateUrl: './show-filter.html',
  styleUrls: ['./show-filter.css']
})
export class ShowFilter {
  DateString(date: any): string {
    return date.toDateString();
  } 
  @Output() filtersChanged = new EventEmitter<any>();

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

    this.filterForm.valueChanges.subscribe(() => this.emitFilters());

    // populate dropdowns
    showService.getShows().subscribe(shows => {
      this.languageOptions = Array.from(new Set(
        shows.flatMap(s => Array.isArray(s.language) ? s.language : (s.language ? [s.language] : []))
      ));

      this.formatOptions = Array.from(new Set(
        shows.flatMap(s => Array.isArray(s.format) ? s.format : (s.format ? [s.format] : []))
      ));
    });

    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      this.next7Days.push(d);
    }
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.emitFilters();
  }
  private emitFilters() {
    const values = this.filterForm.value;

    this.filtersChanged.emit({
      language: values.language || null,
      format: values.format || null,
      show_date: this.selectedDate ? this.selectedDate.toISOString().split('T')[0] : null
    });
  }
}
