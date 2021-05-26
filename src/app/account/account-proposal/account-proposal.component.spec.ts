import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountProposalComponent } from './account-proposal.component';

describe('AccountProposalComponent', () => {
  let component: AccountProposalComponent;
  let fixture: ComponentFixture<AccountProposalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
