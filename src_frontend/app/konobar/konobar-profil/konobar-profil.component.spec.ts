import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonobarProfilComponent } from './konobar-profil.component';

describe('KonobarProfilComponent', () => {
  let component: KonobarProfilComponent;
  let fixture: ComponentFixture<KonobarProfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KonobarProfilComponent]
    });
    fixture = TestBed.createComponent(KonobarProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
