import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CustCafDetailsMenuComponent } from "./cust-caf-details-menu.component";

describe("CustCafDetailsMenuComponent", () => {
  let component: CustCafDetailsMenuComponent;
  let fixture: ComponentFixture<CustCafDetailsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustCafDetailsMenuComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustCafDetailsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
