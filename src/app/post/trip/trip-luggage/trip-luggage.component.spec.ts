import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripLuggageComponent } from './trip-luggage.component';

describe('TripLuggageComponent', () => {
  let component: TripLuggageComponent;
  let fixture: ComponentFixture<TripLuggageComponent>;

  beforeEach(async(() => {
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
