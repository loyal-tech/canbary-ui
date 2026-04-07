import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskTicketSubCategoryComponent } from './task-ticket-sub-category.component';

describe('TaskTicketSubCategoryComponent', () => {
    let component: TaskTicketSubCategoryComponent;
    let fixture: ComponentFixture<TaskTicketSubCategoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaskTicketSubCategoryComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskTicketSubCategoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
