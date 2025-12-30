import { TestBed } from '@angular/core/testing';

import { Couponservices } from './couponservices';

describe('Couponservices', () => {
  let service: Couponservices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Couponservices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
