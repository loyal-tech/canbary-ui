import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RadiusIpManagementComponent } from "./radius-ip.component";

describe("RadiusIpManagementComponent", () => {
  let component: RadiusIpManagementComponent;
  let fixture: ComponentFixture<RadiusIpManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiusIpManagementComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusIpManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
