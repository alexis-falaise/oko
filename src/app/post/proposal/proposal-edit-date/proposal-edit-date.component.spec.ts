import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProposalEditDateComponent } from './proposal-edit-date.component';

describe('ProposalEditDateComponent', () => {
  let component: ProposalEditDateComponent;
  let fixture: ComponentFixture<ProposalEditDateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalEditDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalEditDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
