/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerCafChangeDiscountComponent } from "./customer-caf-change-discount.component";

describe("CustomerCafChangeDiscountComponent", () => {
  let component: CustomerCafChangeDiscountComponent;
  let fixture: ComponentFixture<CustomerCafChangeDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerCafChangeDiscountComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCafChangeDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
