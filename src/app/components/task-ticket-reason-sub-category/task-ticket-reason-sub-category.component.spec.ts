import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskTicketReasonSubCategoryComponent } from './task-ticket-reason-sub-category.component';


describe('TaskTicketReasonSubCategoryComponent', () => {
    let component: TaskTicketReasonSubCategoryComponent;
    let fixture: ComponentFixture<TaskTicketReasonSubCategoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaskTicketReasonSubCategoryComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskTicketReasonSubCategoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
