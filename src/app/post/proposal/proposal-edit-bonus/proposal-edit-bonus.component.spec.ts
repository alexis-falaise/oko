import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalEditBonusComponent } from './proposal-edit-bonus.component';

describe('ProposalEditBonusComponent', () => {
  let component: ProposalEditBonusComponent;
  let fixture: ComponentFixture<ProposalEditBonusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalEditBonusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalEditBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
