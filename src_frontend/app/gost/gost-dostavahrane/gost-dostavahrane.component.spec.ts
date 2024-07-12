import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GostDostavahraneComponent } from './gost-dostavahrane.component';

describe('GostDostavahraneComponent', () => {
  let component: GostDostavahraneComponent;
  let fixture: ComponentFixture<GostDostavahraneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GostDostavahraneComponent]
    });
    fixture = TestBed.createComponent(GostDostavahraneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
