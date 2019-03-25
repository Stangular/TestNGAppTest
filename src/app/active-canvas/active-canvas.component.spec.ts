import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveCanvasComponent } from './active-canvas.component';

describe('ActiveCanvasComponent', () => {
  let component: ActiveCanvasComponent;
  let fixture: ComponentFixture<ActiveCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
