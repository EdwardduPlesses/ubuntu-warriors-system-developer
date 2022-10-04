import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierodersHelpComponent } from './supplieroders-help.component';

describe('SupplierodersHelpComponent', () => {
  let component: SupplierodersHelpComponent;
  let fixture: ComponentFixture<SupplierodersHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierodersHelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierodersHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
