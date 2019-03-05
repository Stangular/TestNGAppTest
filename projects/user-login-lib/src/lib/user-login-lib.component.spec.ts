import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLoginLibComponent } from './user-login-lib.component';

describe('UserLoginLibComponent', () => {
  let component: UserLoginLibComponent;
  let fixture: ComponentFixture<UserLoginLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLoginLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoginLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
