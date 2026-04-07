import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MyAchievementComponent } from "./my-achievement.component";

describe("MyAchievementComponent", () => {
  let component: MyAchievementComponent;
  let fixture: ComponentFixture<MyAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyAchievementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
