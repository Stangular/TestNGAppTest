import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasDesignerPropertyToolbarComponent } from './canvas-designer-property-toolbar.component';

describe('CanvasDesignerPropertyToolbarComponent', () => {
  let component: CanvasDesignerPropertyToolbarComponent;
  let fixture: ComponentFixture<CanvasDesignerPropertyToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasDesignerPropertyToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasDesignerPropertyToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
