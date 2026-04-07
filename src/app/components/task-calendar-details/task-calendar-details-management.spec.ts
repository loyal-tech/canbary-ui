import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TaskCalendarDetails } from "./task-calendar-details-management.component";

describe("TaskTicketManagementComponent", () => {
  let component: TaskCalendarDetails;
  let fixture: ComponentFixture<TaskCalendarDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskCalendarDetails]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCalendarDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
