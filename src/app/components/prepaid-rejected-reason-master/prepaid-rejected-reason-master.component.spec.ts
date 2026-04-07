import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PrepaidRejectedReasonMasterComponent } from "./prepaid-rejected-reason-master.component";

describe("PrepaidRejectedReasonMasterComponent", () => {
  let component: PrepaidRejectedReasonMasterComponent;
  let fixture: ComponentFixture<PrepaidRejectedReasonMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrepaidRejectedReasonMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepaidRejectedReasonMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
