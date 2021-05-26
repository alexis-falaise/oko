import { TestBed } from '@angular/core/testing';

import { MessengerService } from './messenger.service';

describe('MessengerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessengerService = TestBed.inject(MessengerService);
    expect(service).toBeTruthy();
  });
});
