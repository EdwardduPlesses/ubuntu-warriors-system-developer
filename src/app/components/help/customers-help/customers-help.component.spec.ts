import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersHelpComponent } from './customers-help.component';

describe('CustomersHelpComponent', () => {
  let component: CustomersHelpComponent;
  let fixture: ComponentFixture<CustomersHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomersHelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
