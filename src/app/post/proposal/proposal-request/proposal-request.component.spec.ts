import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalRequestComponent } from './proposal-request.component';

describe('ProposalRequestComponent', () => {
  let component: ProposalRequestComponent;
  let fixture: ComponentFixture<ProposalRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
