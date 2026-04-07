import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoiceRecordPaymentComponent } from './invoice-record-payment.component';


describe('RecordPaymentComponent', () => {
  let component: InvoiceRecordPaymentComponent;
  let fixture: ComponentFixture<InvoiceRecordPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceRecordPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceRecordPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
