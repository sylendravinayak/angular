import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nowshowing } from './nowshowing';

describe('Nowshowing', () => {
  let component: Nowshowing;
  let fixture: ComponentFixture<Nowshowing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nowshowing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nowshowing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
