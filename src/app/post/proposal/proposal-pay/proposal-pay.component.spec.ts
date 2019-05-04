import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalPayComponent } from './proposal-pay.component';

describe('ProposalPayComponent', () => {
  let component: ProposalPayComponent;
  let fixture: ComponentFixture<ProposalPayComponent>;

  beforeEach(async(() => {
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
