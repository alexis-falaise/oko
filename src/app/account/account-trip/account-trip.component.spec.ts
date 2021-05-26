import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountTripComponent } from './account-trip.component';

describe('AccountTripComponent', () => {
  let component: AccountTripComponent;
  let fixture: ComponentFixture<AccountTripComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
