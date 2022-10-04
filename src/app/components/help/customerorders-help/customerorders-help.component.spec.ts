import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerordersHelpComponent } from './customerorders-help.component';

describe('CustomerordersHelpComponent', () => {
  let component: CustomerordersHelpComponent;
  let fixture: ComponentFixture<CustomerordersHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerordersHelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerordersHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
