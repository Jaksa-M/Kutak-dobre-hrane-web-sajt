import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromeniLozinkuComponent } from './promeni-lozinku.component';

describe('PromeniLozinkuComponent', () => {
  let component: PromeniLozinkuComponent;
  let fixture: ComponentFixture<PromeniLozinkuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromeniLozinkuComponent]
    });
    fixture = TestBed.createComponent(PromeniLozinkuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
