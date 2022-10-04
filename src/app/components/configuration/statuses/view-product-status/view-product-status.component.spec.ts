import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProductStatusComponent } from './view-product-status.component';

describe('ViewProductStatusComponent', () => {
  let component: ViewProductStatusComponent;
  let fixture: ComponentFixture<ViewProductStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewProductStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProductStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
