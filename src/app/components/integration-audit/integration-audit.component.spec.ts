import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IntegrationAuditComponent } from "./integration-audit.component";

describe("IntegrationAuditComponent", () => {
  let component: IntegrationAuditComponent;
  let fixture: ComponentFixture<IntegrationAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntegrationAuditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
