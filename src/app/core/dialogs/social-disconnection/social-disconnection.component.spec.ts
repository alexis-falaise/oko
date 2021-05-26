import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SocialDisconnectionComponent } from './social-disconnection.component';

describe('SocialDisconnectionComponent', () => {
  let component: SocialDisconnectionComponent;
  let fixture: ComponentFixture<SocialDisconnectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialDisconnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialDisconnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
