import { Component,input} from '@angular/core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-date-picker',
  imports: [DatePipe],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
  standalone: true,
})
export class DatePicker {
  curr_date=input<Date>();

}
