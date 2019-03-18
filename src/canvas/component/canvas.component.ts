import {
  Component,
  ElementRef,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterContentInit,
  OnDestroy
} from '@angular/core';
import { ContextSystem, ContextLayer } from '../models/IContextItem';
import { ExperimentalLayer } from '../models/custom/layers/experimentalLayer';
//import { BarLayer } from '../models/custom/layers/charts/content/bars/verticalbars';
import { DisplayValues } from '../models/DisplayValues';
import { ChartLayer } from '../models/custom/layers/charts/chart.layer';
import { Area } from '../models/shapes/primitives/area';
import { Margin } from '../models/shapes/primitives/margin';
import { Size } from '../models/shapes/primitives/size';
import { Point } from '../models/shapes/primitives/point';
import { ShapeSelectResult } from '../models/shapes/shapeSelected';
import { Records } from 'src/dataManagement/model/records';
import { MessageService } from 'src/app/messaging/message.service';
import { Subscription } from 'rxjs';
import { CanvasService } from '../canvas.service';

export class CanvasContextModel {
  size: Size = new Size();
  data: any;

  constructor() {

  }
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class CanvasComponent implements OnInit, AfterContentInit, OnDestroy {
  subscription: Subscription;
  width: number = 0;
  height: number = 0;
  system: ContextSystem;
  shapeSelectResult: ShapeSelectResult = new ShapeSelectResult();
  @Input() id: string = '';
  @Input() source: Records<string>;
  @ViewChild('thiscanvas') CanvasComponent: ElementRef;
  @Input() canvasID: string = 'testCanvas';
  @Input() margin: Margin;
  @Output() select: EventEmitter<ShapeSelectResult> = new EventEmitter<ShapeSelectResult>();


  private point: Point = new Point();

  constructor(private messageService: MessageService, private canvasService: CanvasService) {

    this.width = 1200; //rect.width;
    this.height = 600; //rect.height;
    this.subscription = this.messageService.getMessage().subscribe(message => { this.ReDraw(); });
  }

  ngOnInit() { }

  get Canvas() {
    return <HTMLCanvasElement>this.CanvasComponent.nativeElement;
  }

  get Context2D() {
    return (
      this.Canvas.getContext('2d'));
  }

  ngAfterContentInit(): void {
    setTimeout(() =>
      this.ReDraw(), 10);
  }

  OnClick(e: any) {
    let rect = this.Canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    console.log("x: " + x + " y: " + y);
    this.point.SetToPosition(x, y);
    this.shapeSelectResult.point.SetToPosition(x, y);
    this.shapeSelectResult.id = "";
    if (this.system.SelectShape(this.shapeSelectResult)) {
      this.select.emit(this.shapeSelectResult);
    }
  }

  setSize() {
    let parent: Element = (<Element>this.Canvas.parentNode);
    parent = parent.parentElement;
    while (parent.localName != 'mat-grid-tile') {
      parent = parent.parentElement;
    }
    let styles = getComputedStyle(parent);
    let w = parent.offsetWidth || parent.clientWidth; // bug in typescript?  They do exist...
    let h = parent.offsetHeight || parent.clientHeight;

    this.width = w;
    this.height = h;
    this.Canvas.width = this.width;
    this.Canvas.height = this.height;
  }

  onResize(event) {
    
    this.ReDraw();
  }

  ReDraw() {
    this.setSize();
    this.system = this.source.ChartGraphic(this.canvasID, this.width, this.height, 'bar');
    this.Draw();
  }

  Draw() {
    if (!this.system) {
      this.system = new ContextSystem();  // TODO: have default layer for this state.
    }
    let c = this.Context2D;
    c.clearRect(0, 0, this.width, this.height);
    this.system.Draw(c);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
