import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacacsCommandsetComponent } from './tacacs-commandset.component';

describe('TacacsCommandsetComponent', () => {
  let component: TacacsCommandsetComponent;
  let fixture: ComponentFixture<TacacsCommandsetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TacacsCommandsetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TacacsCommandsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
