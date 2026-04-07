/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerCafLedgerComponent } from "./customer-caf-ledger.component";

describe("CustomerCafLedgerComponent", () => {
  let component: CustomerCafLedgerComponent;
  let fixture: ComponentFixture<CustomerCafLedgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerCafLedgerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCafLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
