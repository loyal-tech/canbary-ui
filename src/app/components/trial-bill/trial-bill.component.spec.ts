import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialBillComponent } from './trial-bill.component';

describe('TrialBillComponent', () => {
  let component: TrialBillComponent;
  let fixture: ComponentFixture<TrialBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
