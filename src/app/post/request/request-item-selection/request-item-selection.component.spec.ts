import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestItemSelectionComponent } from './request-item-selection.component';

describe('RequestItemSelectionComponent', () => {
  let component: RequestItemSelectionComponent;
  let fixture: ComponentFixture<RequestItemSelectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestItemSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestItemSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
