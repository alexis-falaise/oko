import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripSizingComponent } from './trip-sizing.component';

describe('TripSizingComponent', () => {
  let component: TripSizingComponent;
  let fixture: ComponentFixture<TripSizingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TripSizingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripSizingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
