import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoranInfoComponent } from './restoran-info.component';

describe('RestoranInfoComponent', () => {
  let component: RestoranInfoComponent;
  let fixture: ComponentFixture<RestoranInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestoranInfoComponent]
    });
    fixture = TestBed.createComponent(RestoranInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
