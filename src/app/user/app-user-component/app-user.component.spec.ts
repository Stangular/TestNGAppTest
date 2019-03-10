import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUserComponentComponent } from './app-user-component.component';

describe('AppUserComponentComponent', () => {
  let component: AppUserComponentComponent;
  let fixture: ComponentFixture<AppUserComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppUserComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUserComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
