import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PartnerDocumenetComponent } from "./partner-documenet.component";

describe("PartnerDocumenetComponent", () => {
  let component: PartnerDocumenetComponent;
  let fixture: ComponentFixture<PartnerDocumenetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartnerDocumenetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerDocumenetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
