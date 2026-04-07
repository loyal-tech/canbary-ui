import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCafNewComponent } from './customer-caf-new.component';

describe('CustomerCafComponent', () => {
  let component: CustomerCafNewComponent;
  let fixture: ComponentFixture<CustomerCafNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCafNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCafNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
