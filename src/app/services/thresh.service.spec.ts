import { TestBed } from '@angular/core/testing';

import { ThreshService } from './thresh.service';

describe('ThreshService', () => {
  let service: ThreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreshService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
