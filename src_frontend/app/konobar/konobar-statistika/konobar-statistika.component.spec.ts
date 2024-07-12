import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonobarStatistikaComponent } from './konobar-statistika.component';

describe('KonobarStatistikaComponent', () => {
  let component: KonobarStatistikaComponent;
  let fixture: ComponentFixture<KonobarStatistikaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KonobarStatistikaComponent]
    });
    fixture = TestBed.createComponent(KonobarStatistikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
