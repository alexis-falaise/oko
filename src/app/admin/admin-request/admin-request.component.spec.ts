import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminRequestComponent } from './admin-request.component';

describe('AdminRequestComponent', () => {
  let component: AdminRequestComponent;
  let fixture: ComponentFixture<AdminRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
