import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBillRunComponent } from './generate-bill-run.component';

describe('GenerateBillRunComponent', () => {
  let component: GenerateBillRunComponent;
  let fixture: ComponentFixture<GenerateBillRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateBillRunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateBillRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
