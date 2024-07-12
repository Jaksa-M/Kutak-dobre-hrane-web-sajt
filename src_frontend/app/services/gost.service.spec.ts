import { TestBed } from '@angular/core/testing';

import { GostService } from './gost.service';

describe('GostService', () => {
  let service: GostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
