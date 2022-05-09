import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceTreeComponent } from './placetree.component';

describe('PlacetreeComponent', () => {
  let component: PlaceTreeComponent;
  let fixture: ComponentFixture<PlaceTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlaceTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
