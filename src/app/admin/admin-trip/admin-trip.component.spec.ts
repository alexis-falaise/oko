import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminTripComponent } from './admin-trip.component';

describe('AdminTripComponent', () => {
  let component: AdminTripComponent;
  let fixture: ComponentFixture<AdminTripComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
