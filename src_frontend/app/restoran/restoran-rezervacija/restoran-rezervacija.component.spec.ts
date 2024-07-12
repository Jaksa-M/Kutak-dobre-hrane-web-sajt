import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoranRezervacijaComponent } from './restoran-rezervacija.component';

describe('RestoranRezervacijaComponent', () => {
  let component: RestoranRezervacijaComponent;
  let fixture: ComponentFixture<RestoranRezervacijaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestoranRezervacijaComponent]
    });
    fixture = TestBed.createComponent(RestoranRezervacijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
