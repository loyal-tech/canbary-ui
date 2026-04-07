import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskTicketManagementComponent } from './task-ticket-management.component';


describe('TaskTicketManagementComponent', () => {
    let component: TaskTicketManagementComponent;
    let fixture: ComponentFixture<TaskTicketManagementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaskTicketManagementComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskTicketManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
