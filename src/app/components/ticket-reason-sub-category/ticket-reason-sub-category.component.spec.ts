import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketReasonSubCategoryComponent } from './ticket-reason-sub-category.component';

describe('TicketReasonSubCategoryComponent', () => {
  let component: TicketReasonSubCategoryComponent;
  let fixture: ComponentFixture<TicketReasonSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketReasonSubCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketReasonSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
