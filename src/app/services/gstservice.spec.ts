import { TestBed } from '@angular/core/testing';

import { Gstservice } from './gstservice';

describe('Gstservice', () => {
  let service: Gstservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Gstservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
