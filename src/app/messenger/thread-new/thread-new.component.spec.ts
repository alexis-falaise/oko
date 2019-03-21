import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadNewComponent } from './thread-new.component';

describe('ThreadNewComponent', () => {
  let component: ThreadNewComponent;
  let fixture: ComponentFixture<ThreadNewComponent>;

  beforeEach(async(() => {
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
