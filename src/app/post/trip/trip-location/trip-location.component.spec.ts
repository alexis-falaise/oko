import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripLocationComponent } from './trip-location.component';

describe('TripLocationComponent', () => {
  let component: TripLocationComponent;
  let fixture: ComponentFixture<TripLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
