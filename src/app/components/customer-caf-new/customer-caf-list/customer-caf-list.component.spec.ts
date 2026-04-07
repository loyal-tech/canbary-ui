import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerCafListComponent } from "./customer-caf-list.component";

describe("CustomerCafListComponent", () => {
  let component: CustomerCafListComponent;
  let fixture: ComponentFixture<CustomerCafListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerCafListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCafListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
