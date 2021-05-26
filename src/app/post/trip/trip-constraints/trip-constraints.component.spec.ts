import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripConstraintsComponent } from './trip-constraints.component';

describe('TripConstraintsComponent', () => {
  let component: TripConstraintsComponent;
  let fixture: ComponentFixture<TripConstraintsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TripConstraintsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripConstraintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
