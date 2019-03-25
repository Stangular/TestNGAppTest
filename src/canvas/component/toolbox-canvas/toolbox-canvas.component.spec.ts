import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolboxCanvasComponent } from './toolbox-canvas.component';

describe('ToolboxCanvasComponent', () => {
  let component: ToolboxCanvasComponent;
  let fixture: ComponentFixture<ToolboxCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolboxCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolboxCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
