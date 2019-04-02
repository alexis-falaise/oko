import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneclickComponent } from './oneclick.component';

describe('OneclickComponent', () => {
  let component: OneclickComponent;
  let fixture: ComponentFixture<OneclickComponent>;

  beforeEach(async(() => {
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
