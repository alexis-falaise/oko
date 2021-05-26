import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ThreadNewComponent } from './thread-new.component';

describe('ThreadNewComponent', () => {
  let component: ThreadNewComponent;
  let fixture: ComponentFixture<ThreadNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
