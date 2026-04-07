import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EnterpriseLeadComponent } from "./enterprise-lead.component";

describe("EnterpriseLeadComponent", () => {
  let component: EnterpriseLeadComponent;
  let fixture: ComponentFixture<EnterpriseLeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnterpriseLeadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
