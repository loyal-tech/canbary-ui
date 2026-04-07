import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateTrialBillRunComponent } from './generate-trial-bill-run.component';

describe('GenerateTrialBillRunComponent', () => {
  let component: GenerateTrialBillRunComponent;
  let fixture: ComponentFixture<GenerateTrialBillRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateTrialBillRunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateTrialBillRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
