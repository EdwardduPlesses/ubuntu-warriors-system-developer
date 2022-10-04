import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProductStatusComponent } from './update-product-status.component';

describe('UpdateProductStatusComponent', () => {
  let component: UpdateProductStatusComponent;
  let fixture: ComponentFixture<UpdateProductStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProductStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProductStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
