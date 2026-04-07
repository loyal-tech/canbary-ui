import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PartnerBilltemplateComponent } from "./partner-bill-template.component";

describe("PartnerBilltemplateComponent", () => {
  let component: PartnerBilltemplateComponent;
  let fixture: ComponentFixture<PartnerBilltemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartnerBilltemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerBilltemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
