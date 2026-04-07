/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerCafStatusComponent } from "./customer-caf-status.component";

describe("CustomerCafStatusComponent", () => {
  let component: CustomerCafStatusComponent;
  let fixture: ComponentFixture<CustomerCafStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerCafStatusComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCafStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
