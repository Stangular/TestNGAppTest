import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckSelectorComponent } from './check-selector.component';

describe('CheckSelectorComponent', () => {
  let component: CheckSelectorComponent;
  let fixture: ComponentFixture<CheckSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
