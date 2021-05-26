import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotConnectedComponent } from './not-connected.component';

describe('NotConnectedComponent', () => {
  let component: NotConnectedComponent;
  let fixture: ComponentFixture<NotConnectedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotConnectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotConnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
