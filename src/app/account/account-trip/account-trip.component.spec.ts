import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTripComponent } from './account-trip.component';

describe('AccountTripComponent', () => {
  let component: AccountTripComponent;
  let fixture: ComponentFixture<AccountTripComponent>;

  beforeEach(async(() => {
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
