import { TestBed } from '@angular/core/testing';

import { KonobarService } from './konobar.service';

describe('KonobarService', () => {
  let service: KonobarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KonobarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
