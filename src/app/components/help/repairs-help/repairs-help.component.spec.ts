import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairsHelpComponent } from './repairs-help.component';

describe('RepairsHelpComponent', () => {
  let component: RepairsHelpComponent;
  let fixture: ComponentFixture<RepairsHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairsHelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairsHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
