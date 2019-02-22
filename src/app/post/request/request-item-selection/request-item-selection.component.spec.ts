import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestItemSelectionComponent } from './request-item-selection.component';

describe('RequestItemSelectionComponent', () => {
  let component: RequestItemSelectionComponent;
  let fixture: ComponentFixture<RequestItemSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestItemSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestItemSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
