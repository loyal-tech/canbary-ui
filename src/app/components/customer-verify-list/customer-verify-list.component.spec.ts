import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustomerVerifyListComponent } from "./customer-verify-list.component";

describe("CustomerVerifyListComponent", () => {
  let component: CustomerVerifyListComponent;
  let fixture: ComponentFixture<CustomerVerifyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerVerifyListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerVerifyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
