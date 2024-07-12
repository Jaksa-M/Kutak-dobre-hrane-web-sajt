import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonobarComponent } from './konobar.component';

describe('KonobarComponent', () => {
  let component: KonobarComponent;
  let fixture: ComponentFixture<KonobarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KonobarComponent]
    });
    fixture = TestBed.createComponent(KonobarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
