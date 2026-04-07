import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TATmasterComponent } from "./tatmaster.component";

describe("TATmasterComponent", () => {
  let component: TATmasterComponent;
  let fixture: ComponentFixture<TATmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TATmasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TATmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
