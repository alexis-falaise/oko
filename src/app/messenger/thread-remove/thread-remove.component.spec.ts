import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ThreadRemoveComponent } from './thread-remove.component';

describe('ThreadRemoveComponent', () => {
  let component: ThreadRemoveComponent;
  let fixture: ComponentFixture<ThreadRemoveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadRemoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
