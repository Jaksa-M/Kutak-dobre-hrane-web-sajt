import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GostRezervacijeComponent } from './gost-rezervacije.component';

describe('GostRezervacijeComponent', () => {
  let component: GostRezervacijeComponent;
  let fixture: ComponentFixture<GostRezervacijeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GostRezervacijeComponent]
    });
    fixture = TestBed.createComponent(GostRezervacijeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
