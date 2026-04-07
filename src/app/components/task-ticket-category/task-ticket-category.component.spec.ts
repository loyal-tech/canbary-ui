import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskTicketCategoryComponent } from './task-ticket-category.component';

describe('TaskTicketCategoryComponent', () => {
    let component: TaskTicketCategoryComponent;
    let fixture: ComponentFixture<TaskTicketCategoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaskTicketCategoryComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskTicketCategoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
