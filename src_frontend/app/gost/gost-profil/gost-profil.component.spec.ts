import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GostProfilComponent } from './gost-profil.component';

describe('GostProfilComponent', () => {
  let component: GostProfilComponent;
  let fixture: ComponentFixture<GostProfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GostProfilComponent]
    });
    fixture = TestBed.createComponent(GostProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
