import { TestBed } from '@angular/core/testing';

import { AzuriranjeService } from './azuriranje.service';

describe('AzuriranjeService', () => {
  let service: AzuriranjeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzuriranjeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
