/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerCafShiftLocationComponent } from "./customer-caf-shiftlocation.component";

describe("CustomerCafShiftLocationComponent", () => {
  let component: CustomerCafShiftLocationComponent;
  let fixture: ComponentFixture<CustomerCafShiftLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerCafShiftLocationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCafShiftLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
