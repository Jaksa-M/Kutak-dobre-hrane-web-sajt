import { TestBed } from '@angular/core/testing';

import { RestoranService } from './restoran.service';

describe('RestoranService', () => {
  let service: RestoranService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestoranService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
