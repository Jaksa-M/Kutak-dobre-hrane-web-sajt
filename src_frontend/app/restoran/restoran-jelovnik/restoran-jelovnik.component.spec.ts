import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoranJelovnikComponent } from './restoran-jelovnik.component';

describe('RestoranJelovnikComponent', () => {
  let component: RestoranJelovnikComponent;
  let fixture: ComponentFixture<RestoranJelovnikComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestoranJelovnikComponent]
    });
    fixture = TestBed.createComponent(RestoranJelovnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
