import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GostComponent } from './gost.component';

describe('GostComponent', () => {
  let component: GostComponent;
  let fixture: ComponentFixture<GostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GostComponent]
    });
    fixture = TestBed.createComponent(GostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
