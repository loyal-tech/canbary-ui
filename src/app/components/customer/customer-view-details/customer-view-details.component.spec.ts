import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerViewDetailsComponent } from "./customer-view-details.component";


describe("CustomerDetailsComponent", () => {
  let component: CustomerViewDetailsComponent;
  let fixture: ComponentFixture<CustomerViewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerViewDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
