import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfileRouteComponent } from './profile-route.component';

describe('ProfileRouteComponent', () => {
  let component: ProfileRouteComponent;
  let fixture: ComponentFixture<ProfileRouteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
