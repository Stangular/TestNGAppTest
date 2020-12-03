import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacetreeComponent } from './placetree.component';

describe('PlacetreeComponent', () => {
  let component: PlacetreeComponent;
  let fixture: ComponentFixture<PlacetreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacetreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacetreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
