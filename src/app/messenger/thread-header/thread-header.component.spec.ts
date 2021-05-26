import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ThreadHeaderComponent } from './thread-header.component';

describe('ThreadHeaderComponent', () => {
  let component: ThreadHeaderComponent;
  let fixture: ComponentFixture<ThreadHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
