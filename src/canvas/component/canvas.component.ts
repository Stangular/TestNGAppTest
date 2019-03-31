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
import { EditModel } from '../models/designer/base.model';

export class CanvasContextModel {
  size: Size = new Size();
  data: any;

  constructor() { }
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

  editOn: boolean = false;
  mouseCaptured: boolean = false;
  subscription: Subscription;
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() system: ContextSystem;
  @Input() editSystem: EditModel;
  shapeSelectResult: ShapeSelectResult = new ShapeSelectResult();
  @Input() id: string = '';
  @Input() source: Records<string>;
  @ViewChild('thiscanvas') thisComponent: ElementRef;
  @ViewChild('actCanvas') aaacanvasComponent: ElementRef;
  @Input() canvasID: string = 'testCanvas';
  @Input() margin: Margin;
  @Output() select: EventEmitter<ShapeSelectResult> = new EventEmitter<ShapeSelectResult>();
  @Output() edit: EventEmitter<ShapeSelectResult> = new EventEmitter<ShapeSelectResult>();

  private point: Point = new Point();

  constructor(private messageService: MessageService, private canvasService: CanvasService) {

    this.width = 1200; //rect.width;
    this.height = 600; //rect.height;
    this.subscription = this.messageService.getMessage().subscribe(message => { this.ReDraw(); });
  }

  ngOnInit() { }

  get Canvas() {
    return <HTMLCanvasElement>this.thisComponent.nativeElement;
  }

  get ActiveCanvas() {
    if (!this.editOn || !this.aaacanvasComponent) {
      //  this.editOn = false;
      return null;
    }
    return <HTMLCanvasElement>this.aaacanvasComponent.nativeElement;
  }

  get Context2D() {
    return this.Canvas.getContext('2d');
  }

  get ActiveContext() {
    return this.ActiveCanvas.getContext('2d');
  }

  ngAfterContentInit(): void {
    setTimeout(() =>
      this.ShowActiveLayer()
      , 10);

  }

  PositionFromEvent(e: any) {
    let rect = this.Canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    console.log("x: " + x + " y: " + y);
    this.point.SetToPosition(x, y);
    this.shapeSelectResult.point.SetToPosition(x, y);
  }

  OnMousedown(e: any) {
    this.PositionFromEvent(e);
    this.shapeSelectResult.id = "";

    if (this.system.Select(this.shapeSelectResult)) {

      this.select.emit(this.shapeSelectResult);
      this.Edit();
      this.ReDraw();
      this.mouseCaptured = true;

    }
  }

  OnActiveClick(e: any) {
    this.PositionFromEvent(e);
    this.shapeSelectResult.id = "";
    this.mouseCaptured = true;

    if (!this.editSystem.Select(this.shapeSelectResult)) {

      this.editOn = false;
      this.edit.emit(this.shapeSelectResult);
      this.ReDraw();
      this.mouseCaptured = false;
      this.OnMousedown(e);
   }
  }

  Edit() {
    this.editOn = this.shapeSelectResult.id.length > 0;
    if (this.editOn) {
 //     this.editSystem.Select(this.shapeSelectResult);
      this.edit.emit(this.shapeSelectResult);
    }
    setTimeout(() =>
      this.ShowActiveLayer()
      , 10);
  }

  ShowActiveLayer() {
    if (this.ActiveCanvas) {
      this.ActiveCanvas.width = this.width;
      this.ActiveCanvas.height = this.height;
      this.Draw();
      this.DrawActive();
    }
    else {
      this.ReDraw();
    }
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
      this.editSystem.MoveItem(this.shapeSelectResult.point);
      this.DrawActive();
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
    if (this.ActiveCanvas) {
      this.ActiveCanvas.width = this.width;
      this.ActiveCanvas.height = this.height;
    }
  }

  ReDraw() {

    this.setSize();
    //if (!this.system) {
    //  this.system = this.source.ChartGraphic(this.canvasID, this.width, this.height, 'bar');
    //}
    this.Draw();

  }

  DrawActive() {
    if (!this.editSystem) {
      this.editSystem = new EditModel();  // TODO: have default layer for this state.
    }
    let c = this.ActiveContext;
    c.clearRect(0, 0, this.width, this.height);
    this.editSystem.Draw(c);
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.ReDraw();
  }

  //@HostListener('document:mousedown', ['$event'])
  //onMouseDown(e) {
  //if (!e) {
  //  return;
  //}
  //let posx = 0;
  //let posy = 0;
  //let c = this.Canvas;
  //if (e.pageX) {
  //  posx = e.pageX;
  //} else if (e.clientX) {
  //  posx = e.clientX + document.body.scrollLeft
  //    + document.documentElement.scrollLeft;
  //}
  //posx = posx - c.offsetLeft;
  //if (e.pageY) {
  //  posy = e.pageY;
  //} else if (e.clientY) {
  //  posy = e.clientY + document.body.scrollTop
  //    + document.documentElement.scrollTop;
  //}
  //posy = posy - c.offsetTop;
  //this.shapeSelectResult.id = "";
  //let rect = this.Canvas.getBoundingClientRect();
  //let x = posx - rect.left;
  //let y = posy - rect.top;
  //if ( x >= 0 && y >= 0 ) {


  //  this.point.SetToPosition(x, y);
  //  this.shapeSelectResult.point.SetToPosition(x, y);

  //  this.shapeSelectResult.id = "";
  //  if (this.system.Select(this.shapeSelectResult)) {
  //    this.select.emit(this.shapeSelectResult);
  //    this.Edit();
  //    this.ReDraw();
  //  }
  //}
  //  return posy;
  //  return posx;
  //this.OnCapture(event);
  //}

  //@HostListener('document:mouseup', ['$event'])
  //onMouseUp(event: any) {
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
