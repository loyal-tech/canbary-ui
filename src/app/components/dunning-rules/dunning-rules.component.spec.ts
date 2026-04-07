import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DunningRulesComponent } from './dunning-rules.component';

describe('DunningRulesComponent', () => {
  let component: DunningRulesComponent;
  let fixture: ComponentFixture<DunningRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DunningRulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DunningRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
