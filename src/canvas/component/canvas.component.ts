import {
  Component,
  ElementRef,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
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
import { EditModel, BaseDesignerModel } from '../models/designer/base.model';
import { CanvasService } from '../service/canvas.service';


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
export class CanvasComponent implements OnInit, AfterViewInit, OnDestroy {

  editOn: boolean = true;
  mouseCaptured: boolean = false;
  subscription: Subscription;
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() system: ContextSystem;
  @Input() editSystem: EditModel;
  @Input() id: string = '';
  @Input() source: Records<string>;
  @ViewChild('staticcanvas') staticCanvas: ElementRef;
  @ViewChild('activeCanvas') activeCanvas: ElementRef;
  @Input() canvasID: string = 'testCanvas';
  @Input() margin: Margin;
  @Output() select: EventEmitter<ShapeSelectResult> = new EventEmitter<ShapeSelectResult>();
  @Output() edit: EventEmitter<ShapeSelectResult> = new EventEmitter<ShapeSelectResult>();
  @Output() move: EventEmitter<ShapeSelectResult> = new EventEmitter<ShapeSelectResult>();
  private point: Point = new Point();

  constructor(private messageService: MessageService, private canvasService: CanvasService) {

    this.subscription = this.messageService.getMessage().subscribe(
      message => { this.AcceptMessage(message) });
  }

  AcceptMessage(message: any) {
   // switch (message.text) {
   //   case 11: break;
   //   case 10: this.editSystem.Draw(this.ActiveContext);
   //     break;
   ////   default: this.ReDraw(); break;
   // }
  }
  ngOnInit() {}

  get StaticCanvas() {
    return <HTMLCanvasElement>this.staticCanvas.nativeElement;
  }

  get ActiveCanvas() {
    if (!this.editOn || !this.activeCanvas) {
      //  this.editOn = false;
      return null;
    }
    return <HTMLCanvasElement>this.activeCanvas.nativeElement;
  }

  ngAfterViewInit(): void {
    setTimeout(() =>
      this.SetActiveLayer()
      , 10);

  }

  get StaticContext() {
    return this.StaticCanvas.getContext('2d');
  }

  get ActiveContext() {
    return this.ActiveCanvas.getContext('2d');
  }

  get ClientArea() {
    return this.StaticCanvas.getBoundingClientRect();
  }

  PositionFromEvent(e: any) {
    let rect = this.StaticCanvas.getBoundingClientRect();
    this.canvasService.SSR.PositionFromEvent(e,rect);
  }

  private Clear() {
    this.StaticContext.clearRect(0,0,this.StaticCanvas.width, this.StaticCanvas.height);
    this.ActiveContext.clearRect(0,0,this.ActiveCanvas.width, this.ActiveCanvas.height);
  }

  OnMousedown(e: any) {
    this.PositionFromEvent(e);
    this.canvasService.Select();
    this.Clear();
    this.canvasService.BaseSystem.Draw(this.StaticContext, this.ActiveContext);
    
  //  this.canvasService.BaseSystem.RedrawStatic(this.StaticCanvas.width, this.StaticCanvas.height);
  //  this.canvasService.BaseSystem.RedrawActive(this.ActiveCanvas.width, this.ActiveCanvas.height);
 }

  CopySelectedContent() {
    let itemId = this.canvasService.shapeSelectResult.id;
    this.system.CopyItem(itemId);
  }

  RemoveSelectedContent() {
    this.system.RemoveContentById(this.canvasService.shapeSelectResult.id);
    this.canvasService.shapeSelectResult.id = "";
   // this.Edit();
    //this.ReDraw();
    this.mouseCaptured = false;

  }

  //Edit() {
  // // this.editOn = this.canvasService.shapeSelectResult.id.length > 0;
  //  if (this.editOn) {
  //    this.edit.emit(this.canvasService.shapeSelectResult);
  //  }
  //  setTimeout(() =>
  //    this.ShowActiveLayer()
  //    , 10);
  //}

  SetActiveLayer() {
    this.setSize();
    if (this.ActiveCanvas) {
      this.canvasService.AddLayer();
   

    }
    else {
      this.canvasService.AddLayer();
    }
  }

  OnRelease(e: any) {
    this.canvasService.SSR.itemCaptured = false;
  }

  OnMouseMove(e: any) {
    if (this.canvasService.SSR.itemCaptured) {

      this.PositionFromEvent(e);
      this.canvasService.BaseSystem.Move(this.canvasService.shapeSelectResult);
      this.canvasService.BaseSystem.Draw(this.StaticContext, this.ActiveContext);
      this.move.emit(this.canvasService.shapeSelectResult);
    }
  }

  setSize() {
    let parent: any = (<Element>this.StaticCanvas.parentNode);
    parent = parent.parentElement;
    while (parent.localName != 'mat-grid-tile') {
      parent = parent.parentElement;
    }

    let styles = getComputedStyle(parent);
    let w = parent.offsetWidth || parent.clientWidth; // bug in typescript?  They do exist...
    let h = parent.offsetHeight || parent.clientHeight;

    this.StaticCanvas.width = w - 2;
    this.StaticCanvas.height = h - 5;
    if (this.ActiveCanvas) {
      this.ActiveCanvas.width = this.StaticCanvas.width;
      this.ActiveCanvas.height = this.StaticCanvas.height;
    }
  }

  //ReDraw() {

  //  this.setSize();
  //  //if (!this.system) {
  //  //  this.system = this.source.ChartGraphic(this.canvasID, this.width, this.height, 'bar');
  //  //}
  //  this.Draw();

  //}

  //DrawActive() {
  //  if (!this.editSystem) {
  //    this.editSystem = new EditModel();  // TODO: have default layer for this state.
  //  }
  //  let c = this.ActiveContext;
  //  c.clearRect(0, 0, this.width, this.height);
  //  this.editSystem.Draw(c);
  //}
  ///// 
  //Draw() {StaticContext
  //  if (!this.system) {
  //    this.system = new ContextSystem();  // TODO: have default layer for this state.
  //  }
  //  let c = this.StaticContext;
  //  c.clearRect(0, 0, this.width, this.height);
  //  this.system.Draw(c);
  //}

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSize();
  //  this.ReDraw();
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
