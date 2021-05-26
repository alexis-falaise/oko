import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestItemNewComponent } from './request-item-new.component';

describe('RequestItemNewComponent', () => {
  let component: RequestItemNewComponent;
  let fixture: ComponentFixture<RequestItemNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestItemNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestItemNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
