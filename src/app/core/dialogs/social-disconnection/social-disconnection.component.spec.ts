import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialDisconnectionComponent } from './social-disconnection.component';

describe('SocialDisconnectionComponent', () => {
  let component: SocialDisconnectionComponent;
  let fixture: ComponentFixture<SocialDisconnectionComponent>;

  beforeEach(async(() => {
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
