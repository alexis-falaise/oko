import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountAvatarUploadComponent } from './account-avatar-upload.component';

describe('AccountAvatarUploadComponent', () => {
  let component: AccountAvatarUploadComponent;
  let fixture: ComponentFixture<AccountAvatarUploadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountAvatarUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAvatarUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
