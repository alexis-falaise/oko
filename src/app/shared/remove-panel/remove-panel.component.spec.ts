import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RemovePanelComponent } from './remove-panel.component';

describe('RemovePanelComponent', () => {
  let component: RemovePanelComponent;
  let fixture: ComponentFixture<RemovePanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RemovePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
