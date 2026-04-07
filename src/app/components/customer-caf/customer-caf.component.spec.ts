import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCafComponent } from './customer-caf.component';

describe('CustomerCafComponent', () => {
  let component: CustomerCafComponent;
  let fixture: ComponentFixture<CustomerCafComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerCafComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
