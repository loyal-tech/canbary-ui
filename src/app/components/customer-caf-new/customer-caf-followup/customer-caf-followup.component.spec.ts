/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerCafFollowupComponent } from "./customer-caf-followup.component";

describe("CustomerCafFollowupComponent", () => {
  let component: CustomerCafFollowupComponent;
  let fixture: ComponentFixture<CustomerCafFollowupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerCafFollowupComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCafFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
