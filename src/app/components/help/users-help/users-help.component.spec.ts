import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersHelpComponent } from './users-help.component';

describe('UsersHelpComponent', () => {
  let component: UsersHelpComponent;
  let fixture: ComponentFixture<UsersHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersHelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
