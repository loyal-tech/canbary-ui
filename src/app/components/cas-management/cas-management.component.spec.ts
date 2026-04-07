import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CASManagementComponent } from "./cas-management.component";

describe("CASManagementComponent", () => {
  let component: CASManagementComponent;
  let fixture: ComponentFixture<CASManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CASManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CASManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
