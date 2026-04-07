import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerCafCreateComponent } from "./customer-caf-create.component";

describe("CustomerCafCreateComponent", () => {
  let component: CustomerCafCreateComponent;
  let fixture: ComponentFixture<CustomerCafCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerCafCreateComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCafCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
