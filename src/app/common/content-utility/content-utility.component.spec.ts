import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentUtilityComponent } from './content-utility.component';

describe('ContentUtilityComponent', () => {
  let component: ContentUtilityComponent;
  let fixture: ComponentFixture<ContentUtilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentUtilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
