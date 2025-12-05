import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedMovie } from './recommended-movie';
import { inject } from 'vitest';

describe('RecommendedMovie', () => {
  let component: RecommendedMovie;
  let fixture: ComponentFixture<RecommendedMovie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedMovie]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendedMovie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
