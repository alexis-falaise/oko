import { TestBed } from '@angular/core/testing';

import { HistoryService } from './history.service';

describe('HistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoryService = TestBed.inject(HistoryService);
    expect(service).toBeTruthy();
  });
});
