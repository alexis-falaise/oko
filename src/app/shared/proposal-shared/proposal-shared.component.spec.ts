import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalSharedComponent } from './proposal-shared.component';

describe('ProposalSharedComponent', () => {
  let component: ProposalSharedComponent;
  let fixture: ComponentFixture<ProposalSharedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalSharedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
