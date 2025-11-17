import { TestBed } from '@angular/core/testing';

import { PricePeriodService } from './price-period.service';

describe('PricePeriodService', () => {
  let service: PricePeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PricePeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
