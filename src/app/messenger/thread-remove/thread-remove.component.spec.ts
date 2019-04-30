import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadRemoveComponent } from './thread-remove.component';

describe('ThreadRemoveComponent', () => {
  let component: ThreadRemoveComponent;
  let fixture: ComponentFixture<ThreadRemoveComponent>;

  beforeEach(async(() => {
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
