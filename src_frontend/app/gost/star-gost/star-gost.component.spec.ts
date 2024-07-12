import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarGostComponent } from './star-gost.component';

describe('StarGostComponent', () => {
  let component: StarGostComponent;
  let fixture: ComponentFixture<StarGostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StarGostComponent]
    });
    fixture = TestBed.createComponent(StarGostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
