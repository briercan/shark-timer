import { TestBed } from '@angular/core/testing';

import { ActiveClockService } from './active-clock.service';

describe('ActiveClockService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActiveClockService = TestBed.get(ActiveClockService);
    expect(service).toBeTruthy();
  });
});
