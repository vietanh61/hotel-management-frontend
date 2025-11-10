import { TestBed } from '@angular/core/testing';

import { RoomStatusService } from './room-status.service';

describe('RoomStatusService', () => {
  let service: RoomStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
