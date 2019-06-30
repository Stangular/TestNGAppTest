import {
  Component,
  ElementRef,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterContentInit,
  OnDestroy,
  HostListener
} from '@angular/core';
import { ContextSystem, ContextLayer } from '../../models/IContextItem';
import { ExperimentalLayer } from '../../models/custom/layers/experimentalLayer';
//import { BarLayer } from '../models/custom/layers/charts/content/bars/verticalbars';
import { DisplayValues } from '../../models/DisplayValues';
import { ChartLayer } from '../../models/custom/layers/charts/chart.layer';
import { Area } from '../../models/shapes/primitives/area';
import { Margin } from '../../models/shapes/primitives/margin';
import { Size } from '../../models/shapes/primitives/size';
import { Point } from '../../models/shapes/primitives/point';
import { ShapeSelectResult } from '../../models/shapes/shapeSelected';
import { Records } from 'src/dataManagement/model/records';
import { MessageService } from 'src/app/messaging/message.service';
import { Subscription } from 'rxjs';

export class CanvasContextModel {
  size: Size = new Size();
  data: any;

  constructor() {

  }
}

@Component({
  selector: 'app-toolbox-canvas',
  templateUrl: './toolbox-canvas.component.html',
  styleUrls: ['./toolbox-canvas.component.css']
})
export class ToolboxCanvasComponent implements OnInit, OnDestroy{

  editOn: boolean = true;
  mouseCaptured: boolean = false;
  messageSubscription: Subscription;
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() system: ContextSystem;
  shapeSelectResult: ShapeSelectResult = new ShapeSelectResult();
  @Input() id: string = '';
  @Input() source: Records<string>;
  @ViewChild('toolbarcanvas') CanvasComponent: ElementRef;
  @Input() canvasID: string = 'testCanvas';
  @Input() margin: Margin;
  @Output() toolselect: EventEmitter<ShapeSelectResult> = new EventEmitter<ShapeSelectResult>();

  private point: Point = new Point();

  constructor(private messageService: MessageService) {

    this.width = 1200; //rect.width;
    this.height = 600; //rect.height;
    this.messageSubscription = this.messageService.getMessage().subscribe(message => { this.ReDraw(); });
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

  PositionFromEvent(e: any) {
    let rect = this.Canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    this.point.SetToPosition(x, y);
    this.shapeSelectResult.point.SetToPosition(x, y);
  }

  OnClick(e: any) {
    this.PositionFromEvent(e);
    this.shapeSelectResult.id = "";
    if (this.system.Select(this.shapeSelectResult)) {
      this.toolselect.emit(this.shapeSelectResult);
    }
    setTimeout(() =>
      this.Draw()
      , 10);
  }

  OnCapture(e: any) {
    this.mouseCaptured = true;
  }

  OnRelease(e: any) {
    this.mouseCaptured = false
  }

  OnMouseMove(e: any) {
    if (this.mouseCaptured) {
      this.PositionFromEvent(e);
    }
  }

  setSize() {
    let parent: any = (<Element>this.Canvas.parentNode);
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

  ReDraw() {

   // this.setSize();
    //if (!this.system) {
    //  this.system = this.source.ChartGraphic(this.canvasID, this.width, this.height, 'bar');
    //}
  //  this.Draw();

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
    this.messageSubscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.ReDraw();
  }

  //@HostListener('document:mousedown', ['$event'])
  //onMouseDown(event) {
  //  this.OnCapture(event);
  //}

  //@HostListener('document:mouseup', ['$event'])
  //onMouseUp(event) {
  //  this.OnRelease(event);
  //}

  //@HostListener('mousemove', ['$event'])
  //onMousemove(event: MouseEvent) {
  //  if (this.mouseDown) {
  //    this.scene.rotate(
  //      event.clientX - this.last.clientX,
  //      event.clientY - this.last.clientY
  //    );
  //    this.last = event;
  //  }
  //}

}
