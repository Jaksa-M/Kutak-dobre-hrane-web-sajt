import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GostRestoraniComponent } from './gost-restorani.component';

describe('GostRestoraniComponent', () => {
  let component: GostRestoraniComponent;
  let fixture: ComponentFixture<GostRestoraniComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GostRestoraniComponent]
    });
    fixture = TestBed.createComponent(GostRestoraniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
