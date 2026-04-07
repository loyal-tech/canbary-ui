import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QosPolicyComponent } from './qos-policy.component';

describe('QosPolicyComponent', () => {
  let component: QosPolicyComponent;
  let fixture: ComponentFixture<QosPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QosPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QosPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
