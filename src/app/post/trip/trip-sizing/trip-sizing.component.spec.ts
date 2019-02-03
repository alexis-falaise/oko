import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripSizingComponent } from './trip-sizing.component';

describe('TripSizingComponent', () => {
  let component: TripSizingComponent;
  let fixture: ComponentFixture<TripSizingComponent>;

  beforeEach(async(() => {
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
