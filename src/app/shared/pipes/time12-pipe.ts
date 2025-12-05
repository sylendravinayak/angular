import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time12',
  standalone: true,
})
export class Time12Pipe implements PipeTransform {
  transform(time: string): string {
    if (!time) return '';

    const [hour, minute] = time.split(':').map(Number);

    const suffix = hour >= 12 ? 'PM' : 'AM';
    const hr = hour % 12 || 12;

    return `${hr}:${minute.toString().padStart(2, '0')} ${suffix}`;
  }
}
