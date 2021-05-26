import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProposalTripComponent } from './proposal-trip.component';

describe('ProposalTripComponent', () => {
  let component: ProposalTripComponent;
  let fixture: ComponentFixture<ProposalTripComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalTripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
