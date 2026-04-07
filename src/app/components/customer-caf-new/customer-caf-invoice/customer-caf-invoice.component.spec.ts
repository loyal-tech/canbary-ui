/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerCafInvoiceComponent } from "./customer-caf-invoice.component";

describe("CustomerCafInvoiceComponent", () => {
  let component: CustomerCafInvoiceComponent;
  let fixture: ComponentFixture<CustomerCafInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerCafInvoiceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCafInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
