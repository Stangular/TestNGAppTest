import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasShapePropertyDialogComponent } from './canvas-shape-property-dialog.component';

describe('CanvasShapePropertyDialogComponent', () => {
  let component: CanvasShapePropertyDialogComponent;
  let fixture: ComponentFixture<CanvasShapePropertyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasShapePropertyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasShapePropertyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
