import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonobarRezervacijeComponent } from './konobar-rezervacije.component';

describe('KonobarRezervacijeComponent', () => {
  let component: KonobarRezervacijeComponent;
  let fixture: ComponentFixture<KonobarRezervacijeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KonobarRezervacijeComponent]
    });
    fixture = TestBed.createComponent(KonobarRezervacijeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
