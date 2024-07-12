import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoranComponent } from './restoran.component';

describe('RestoranComponent', () => {
  let component: RestoranComponent;
  let fixture: ComponentFixture<RestoranComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestoranComponent]
    });
    fixture = TestBed.createComponent(RestoranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
