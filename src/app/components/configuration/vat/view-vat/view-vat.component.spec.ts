import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVatComponent } from './view-vat.component';

describe('ViewVatComponent', () => {
  let component: ViewVatComponent;
  let fixture: ComponentFixture<ViewVatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
