import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AcctProfileCreateComponent } from "./acct-profile-create.component";

describe("AcctProfileCreateComponent", () => {
  let component: AcctProfileCreateComponent;
  let fixture: ComponentFixture<AcctProfileCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcctProfileCreateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcctProfileCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
