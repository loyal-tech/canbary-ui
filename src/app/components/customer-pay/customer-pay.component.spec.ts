import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerPayComponent } from "./customer-pay.component";

describe("CustomerPayComponent", () => {
  let component: CustomerPayComponent;
  let fixture: ComponentFixture<CustomerPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerPayComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
