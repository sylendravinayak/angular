import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Appcarosel } from './appcarosel';

describe('Appcarosel', () => {
  let component: Appcarosel;
  let fixture: ComponentFixture<Appcarosel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Appcarosel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Appcarosel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
