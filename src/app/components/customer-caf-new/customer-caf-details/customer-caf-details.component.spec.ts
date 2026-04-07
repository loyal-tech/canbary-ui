import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerCafDetailsComponent } from "./customer-caf-details.component";

describe("CustomerCafDetailsComponent", () => {
  let component: CustomerCafDetailsComponent;
  let fixture: ComponentFixture<CustomerCafDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerCafDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCafDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
