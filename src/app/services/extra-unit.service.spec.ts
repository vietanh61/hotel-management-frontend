import { TestBed } from '@angular/core/testing';

import { ExtraUnitService } from './extra-unit.service';

describe('ExtraUnitService', () => {
  let service: ExtraUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtraUnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
