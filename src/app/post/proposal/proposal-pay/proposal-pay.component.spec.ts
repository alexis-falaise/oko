import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProposalPayComponent } from './proposal-pay.component';

describe('ProposalPayComponent', () => {
  let component: ProposalPayComponent;
  let fixture: ComponentFixture<ProposalPayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
