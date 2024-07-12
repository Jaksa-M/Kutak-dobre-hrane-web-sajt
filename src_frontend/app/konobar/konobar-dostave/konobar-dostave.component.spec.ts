import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonobarDostaveComponent } from './konobar-dostave.component';

describe('KonobarDostaveComponent', () => {
  let component: KonobarDostaveComponent;
  let fixture: ComponentFixture<KonobarDostaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KonobarDostaveComponent]
    });
    fixture = TestBed.createComponent(KonobarDostaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
