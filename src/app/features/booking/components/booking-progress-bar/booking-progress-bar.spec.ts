import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingProgressBar } from './booking-progress-bar';

describe('BookingProgressBar', () => {
  let component: BookingProgressBar;
  let fixture: ComponentFixture<BookingProgressBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingProgressBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingProgressBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
