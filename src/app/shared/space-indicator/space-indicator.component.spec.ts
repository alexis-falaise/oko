import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpaceIndicatorComponent } from './space-indicator.component';

describe('SpaceIndicatorComponent', () => {
  let component: SpaceIndicatorComponent;
  let fixture: ComponentFixture<SpaceIndicatorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
