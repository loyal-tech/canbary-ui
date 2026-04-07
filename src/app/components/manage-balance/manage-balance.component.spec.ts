import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBalanceComponent } from './manage-balance.component';

describe('ManageBalanceComponent', () => {
  let component: ManageBalanceComponent;
  let fixture: ComponentFixture<ManageBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
