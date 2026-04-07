import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacasConfigurationComponent } from './tacas-configuration.component';

describe('TacasConfigurationComponent', () => {
  let component: TacasConfigurationComponent;
  let fixture: ComponentFixture<TacasConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TacasConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TacasConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
