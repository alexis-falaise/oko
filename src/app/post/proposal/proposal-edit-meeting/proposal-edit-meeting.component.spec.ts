import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalEditMeetingComponent } from './proposal-edit-meeting.component';

describe('ProposalEditMeetingComponent', () => {
  let component: ProposalEditMeetingComponent;
  let fixture: ComponentFixture<ProposalEditMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalEditMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalEditMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
