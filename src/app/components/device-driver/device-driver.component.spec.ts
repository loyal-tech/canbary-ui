import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DeviceDriverComponent } from "./device-driver.component";

describe("DeviceDriverComponent", () => {
  let component: DeviceDriverComponent;
  let fixture: ComponentFixture<DeviceDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeviceDriverComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
