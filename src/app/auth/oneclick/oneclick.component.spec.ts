import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OneclickComponent } from './oneclick.component';

describe('OneclickComponent', () => {
  let component: OneclickComponent;
  let fixture: ComponentFixture<OneclickComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OneclickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneclickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
