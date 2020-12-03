import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteEditComponent } from './auto-complete-edit.component';

describe('AutoCompleteEditComponent', () => {
  let component: AutoCompleteEditComponent;
  let fixture: ComponentFixture<AutoCompleteEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoCompleteEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
