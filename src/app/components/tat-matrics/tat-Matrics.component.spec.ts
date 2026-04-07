import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TATMatricsComponent } from './tat-Matrics.component';

describe('TATMatricsComponent', () => {
  let component: TATMatricsComponent;
  let fixture: ComponentFixture<TATMatricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TATMatricsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TATMatricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
