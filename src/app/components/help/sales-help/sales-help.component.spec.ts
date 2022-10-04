import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesHelpComponent } from './sales-help.component';

describe('SalesHelpComponent', () => {
  let component: SalesHelpComponent;
  let fixture: ComponentFixture<SalesHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesHelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
