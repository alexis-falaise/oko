import { TestBed } from '@angular/core/testing';

import { PexelsService } from './pexels.service';

describe('PexelsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PexelsService = TestBed.inject(PexelsService);
    expect(service).toBeTruthy();
  });
});
