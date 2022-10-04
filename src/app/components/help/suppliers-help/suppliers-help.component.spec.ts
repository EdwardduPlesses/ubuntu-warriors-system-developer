import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppliersHelpComponent } from './suppliers-help.component';

describe('SuppliersHelpComponent', () => {
  let component: SuppliersHelpComponent;
  let fixture: ComponentFixture<SuppliersHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppliersHelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuppliersHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
