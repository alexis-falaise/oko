import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfileRouteTripComponent } from './profile-route-trip.component';

describe('ProfileRouteTripComponent', () => {
  let component: ProfileRouteTripComponent;
  let fixture: ComponentFixture<ProfileRouteTripComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileRouteTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRouteTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
