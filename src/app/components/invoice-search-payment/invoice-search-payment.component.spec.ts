import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoiceSearchPaymentComponent } from './invoice-search-payment.component';


describe('InvoiceSearchPaymentComponent', () => {
  let component: InvoiceSearchPaymentComponent;
  let fixture: ComponentFixture<InvoiceSearchPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceSearchPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceSearchPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
