import { TestBed } from '@angular/core/testing';

import { LozinkaService } from './lozinka.service';

describe('LozinkaService', () => {
  let service: LozinkaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LozinkaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
