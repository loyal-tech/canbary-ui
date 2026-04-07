import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TaskTATmasterComponent } from "./task-for-tatmaster.component";

describe("TaskTATmasterComponent", () => {
    let component: TaskTATmasterComponent;
    let fixture: ComponentFixture<TaskTATmasterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaskTATmasterComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskTATmasterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
