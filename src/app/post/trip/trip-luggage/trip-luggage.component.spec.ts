import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripLuggageComponent } from './trip-luggage.component';

describe('TripLuggageComponent', () => {
  let component: TripLuggageComponent;
  let fixture: ComponentFixture<TripLuggageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TripLuggageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripLuggageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
