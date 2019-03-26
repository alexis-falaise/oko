import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceIndicatorComponent } from './space-indicator.component';

describe('SpaceIndicatorComponent', () => {
  let component: SpaceIndicatorComponent;
  let fixture: ComponentFixture<SpaceIndicatorComponent>;

  beforeEach(async(() => {
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
