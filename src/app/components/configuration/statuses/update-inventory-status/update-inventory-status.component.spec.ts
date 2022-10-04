import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInventoryStatusComponent } from './update-inventory-status.component';

describe('UpdateInventoryStatusComponent', () => {
  let component: UpdateInventoryStatusComponent;
  let fixture: ComponentFixture<UpdateInventoryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateInventoryStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateInventoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
