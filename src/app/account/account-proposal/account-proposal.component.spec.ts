import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountProposalComponent } from './account-proposal.component';

describe('AccountProposalComponent', () => {
  let component: AccountProposalComponent;
  let fixture: ComponentFixture<AccountProposalComponent>;

  beforeEach(async(() => {
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
