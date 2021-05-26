import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CityDisplayComponent } from './city-display.component';

describe('CityDisplayComponent', () => {
  let component: CityDisplayComponent;
  let fixture: ComponentFixture<CityDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CityDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CityDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
