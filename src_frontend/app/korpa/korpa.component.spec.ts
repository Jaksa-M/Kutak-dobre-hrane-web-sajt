import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KorpaComponent } from './korpa.component';

describe('KorpaComponent', () => {
  let component: KorpaComponent;
  let fixture: ComponentFixture<KorpaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KorpaComponent]
    });
    fixture = TestBed.createComponent(KorpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
