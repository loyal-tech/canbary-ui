import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialInvoiceComponent } from './trial-invoice.component';

describe('TrialInvoiceComponent', () => {
  let component: TrialInvoiceComponent;
  let fixture: ComponentFixture<TrialInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
