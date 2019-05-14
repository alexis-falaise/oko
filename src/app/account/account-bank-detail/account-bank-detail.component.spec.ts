import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBankDetailComponent } from './account-bank-detail.component';

describe('AccountBankDetailComponent', () => {
  let component: AccountBankDetailComponent;
  let fixture: ComponentFixture<AccountBankDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountBankDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBankDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
