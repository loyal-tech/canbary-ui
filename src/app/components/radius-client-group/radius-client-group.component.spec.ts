import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiusClientGroupComponent } from './radius-client-group.component';

describe('RadiusClientGroupComponent', () => {
  let component: RadiusClientGroupComponent;
  let fixture: ComponentFixture<RadiusClientGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadiusClientGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiusClientGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
