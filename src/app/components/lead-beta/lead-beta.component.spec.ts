import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LeadBetaComponent } from "./lead-beta.component";

describe("LeadBetaComponent", () => {
  let component: LeadBetaComponent;
  let fixture: ComponentFixture<LeadBetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeadBetaComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadBetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
