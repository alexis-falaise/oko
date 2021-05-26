import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProposalListItemComponent } from './proposal-list-item.component';

describe('ProposalListItemComponent', () => {
  let component: ProposalListItemComponent;
  let fixture: ComponentFixture<ProposalListItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
