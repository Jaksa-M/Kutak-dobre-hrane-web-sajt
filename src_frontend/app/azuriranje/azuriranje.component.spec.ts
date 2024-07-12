import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzuriranjeComponent } from './azuriranje.component';

describe('AzuriranjeComponent', () => {
  let component: AzuriranjeComponent;
  let fixture: ComponentFixture<AzuriranjeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AzuriranjeComponent]
    });
    fixture = TestBed.createComponent(AzuriranjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
