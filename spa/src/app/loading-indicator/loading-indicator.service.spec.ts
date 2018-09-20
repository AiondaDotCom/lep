import { TestBed, inject } from '@angular/core/testing';

import { LoadingIndicatorService } from './loading-indicator.service';

describe('LoadingIndicatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingIndicatorService]
    });
  });

  it('should be created', inject([LoadingIndicatorService], (service: LoadingIndicatorService) => {
    expect(service).toBeTruthy();
  }));
});
