import { TestBed } from '@angular/core/testing';

import { Bookingstateservice } from './bookingstateservice';

describe('Bookingstateservice', () => {
  let service: Bookingstateservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bookingstateservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
