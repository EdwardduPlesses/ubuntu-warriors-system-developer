import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVatDialogComponent } from './add-vat-dialog.component';

describe('AddVatDialogComponent', () => {
  let component: AddVatDialogComponent;
  let fixture: ComponentFixture<AddVatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVatDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
