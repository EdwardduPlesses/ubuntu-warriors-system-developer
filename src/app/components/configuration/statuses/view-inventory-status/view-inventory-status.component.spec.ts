import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInventoryStatusComponent } from './view-inventory-status.component';

describe('ViewInventoryStatusComponent', () => {
  let component: ViewInventoryStatusComponent;
  let fixture: ComponentFixture<ViewInventoryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewInventoryStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInventoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
