import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AcsMasterComponent } from "./acs-master.component";

describe("AcsMasterComponent", () => {
  let component: AcsMasterComponent;
  let fixture: ComponentFixture<AcsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcsMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
