import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickInvoiceComponent } from './quick-invoice.component';

describe('QuickInvoiceComponent', () => {
  let component: QuickInvoiceComponent;
  let fixture: ComponentFixture<QuickInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
