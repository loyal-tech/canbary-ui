import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketReasonCategoryComponent } from './ticket-reason-category.component';

describe('TicketReasonCategoryComponent', () => {
  let component: TicketReasonCategoryComponent;
  let fixture: ComponentFixture<TicketReasonCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketReasonCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketReasonCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
