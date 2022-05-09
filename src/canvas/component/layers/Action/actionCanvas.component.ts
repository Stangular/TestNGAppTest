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
  OnChanges,
  DoCheck,
  HostListener
} from '@angular/core';
import { ContextSystem, ContextLayer, EventContextLayer } from '../../../models/IContextItem';
import { Margin } from '../../../models/shapes/primitives/margin';
import { Size } from '../../../models/shapes/primitives/size';
import { Point } from '../../../models/shapes/primitives/point';
import { ShapeSelectResult } from '../../../models/shapes/shapeSelected';
import { Records } from 'src/dataManagement/model/records';
import { MessageService } from 'src/app/messaging/message.service';
import { Subscription } from 'rxjs';
import { EditModel } from '../../../models/designer/base.model';
import { CanvasService } from '../../../service/canvas.service';
import { ContextModel } from '../../context.model';
import { DisplayValues } from 'src/canvas/models/DisplayValues';
import { IActionItem } from '../Interfaces/IActionLayer';
import { TimeLineSpanLayerModel } from 'src/canvas/models/concepts/timelines/timeLineSpan.model';
import { Rectangle } from 'src/canvas/models/shapes/rectangle';



export class ActionCanvasContextModel {
  size: Size = new Size();
  data: any;

  constructor() { }
}

@Component({
  selector: 'action-canvas',
  templateUrl: './actionCanvas.component.html',
  styleUrls: ['./actionCanvas.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class ActionCanvasComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck {

  subscription: Subscription;
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() system: ContextSystem;
  @Input() editSystem: EditModel;
  @Input() id: string = '';
  @Input() source: Records<string>;
  @Input() layerName: string = '';
  @Input() UIAction: string = ''; 
  @ViewChild('topCanvas') topCanvas: ElementRef;
  @ViewChild('staticCanvas') theCanvas: ElementRef;
 // @ViewChild('topcanvas') topCanvas: ElementRef;
  @Input() canvasID: string = 'testCanvas';
  @Input() margin: Margin;
  //@Output() select: EventEmitter<ShapeSelectResult> = new EventEmitter<ShapeSelectResult>();
  //@Output() edit: EventEmitter<ShapeSelectResult> = new EventEmitter<ShapeSelectResult>();
  //@Output() move: EventEmitter<ShapeSelectResult> = new EventEmitter<ShapeSelectResult>();
 // private point: Point = new Point();
 // private _contextSystem: ContextSystem = null;
 // private _contextModel: ContextModel = new ContextModel();
//  private _timeSpanLayer: TimeLineSpanLayerModel;
  private _clientArea: Rectangle = null;

 // _actionLayer: EventContextLayer;
  _contextLayer: EventContextLayer;

  _context: CanvasRenderingContext2D;
  _activeContext: CanvasRenderingContext2D;

  constructor(private messageService: MessageService, public canvasService: CanvasService) {

    this.subscription = this.messageService.getMessage().subscribe(
      message => { this.AcceptMessage(message) });
  }

  AcceptMessage(message: any) {
    switch (message.text) {
      case 11: break;
      case 1015:
      case 1001:
        this.onResize(null);
      //  this.Draw(); break;
      //   default: this.ReDraw(); break;
    }
  }

  ngOnInit() {

   
  //  this._timeSpanLayer = new TimeLineSpanLayerModel(this.ClientArea);

    //let layers: ContextLayer[] = [];
    //if (this.initialLayer) {
    //  layers.push(this.initialLayer);
    //  layers.push(this._timeSpanLayer);
    //}
    //this._contextSystem = new ContextSystem(layers);
    //this._contextModel.AddLayerContext(this.canvasID, this.TheContext);
    //this._contextModel.AddLayerContext(this._timeSpanLayer.Id, this.TopContext);
    //this.canvasService.SetCanvasContent('');
  }

  get TheCanvas() {
    return <HTMLCanvasElement>this.theCanvas.nativeElement;
  }

  get TopCanvas() {
    return <HTMLCanvasElement>this.topCanvas.nativeElement;
  }

  get TheContext() {
    return this.TheCanvas.getContext('2d');
  }

  get TopContext() {
    return this.TopCanvas.getContext('2d');
  }

  //get TopCanvas() {
  //  return <HTMLCanvasElement>this.topCanvas.nativeElement;
  //}

  //get TopContext() {
  //  return this.TopCanvas.getContext('2d');
  //}

  ngDoCheck() {
    //if (this.canvasService.EditOn) {
    //  setTimeout(() =>
    //    this.setSize()
    //    , 10);
    //}
  }

  //ngOnChanges() {
  //  setTimeout(() =>
  //    this.SetActiveLayer()
  //    , 10);

  //}

  ngAfterViewInit(): void {
    //setTimeout(() =>
    //  this.SetActiveLayer()
    //  , 10);

    this._context = this.TheContext;
    this._activeContext = this.TopContext;

    setTimeout(() =>
      this.setSize()
      , 10);


  }

  //get StaticContext() {
  //  return this.TheCanvas.getContext('2d');
  //}

  ////get ClientArea(): Rectangle {
  ////  if (!this._clientArea) {
  ////    let area = this.TheCanvas.getBoundingClientRect();
  ////    this._clientArea = new Rectangle('activeBoundingArea', area.top, area.left, area.width, area.height,'DefaultBG');
  ////  }
  ////  return this._clientArea;

  ////}

  PositionFromEvent(e: any) {
    let rect = this.TheCanvas.getBoundingClientRect();
    this.canvasService.SSR.PositionFromEvent(e, rect);
  }

  private Clear() {
    this.TheContext.clearRect(0, 0, this.TheCanvas.width, this.TheCanvas.height);
  }

  //CopySelectedContent() {
  //  let itemId = this.canvasService.shapeSelectResult.id;
  //  this.system.CopyItem(itemId);
  //}

  //RemoveSelectedContent() {
  //  this.system.RemoveContentById(this.canvasService.shapeSelectResult.id);
  //  this.canvasService.shapeSelectResult.id = "";

  //}

  //Edit() {
  // // this.editOn = this.canvasService.shapeSelectResult.id.length > 0;
  //  if (this.editOn) {
  //    this.edit.emit(this.canvasService.shapeSelectResult);
  //  }
  //  setTimeout(() =>
  //    this.ShowActiveLayer()
  //    , 10);
  //}

  //SetActiveLayer() {
  //  this.setSize();
  //  this.canvasService.AddLayer();
  //}

  OnMousedownTop(e: any) {
    this._contextLayer.selectItem(e, this._clientArea, this.TopContext);
    this._contextLayer.Draw(this._context);
//    this.DrawActive();
  }

  OnMouseUpTop(e: any) {
    this.TopContext.clearRect(
      0,
      0,
      this._clientArea.Width,
      this._clientArea.Height);
    this._contextLayer.releaseSelectedItem(this._context);
  //  this.Draw();
  //  this._contextLayer.DrawSizer(this._context);

 //   this.DrawActive();
  }

  OnMouseOutTop(e: any) {
   // this._actionLayer.releaseSelectedItem();
  //  this.Draw();
  }

  OnMouseMoveTop(e: any) {
    this._contextLayer.mouseMove(e, this._clientArea, this.TopContext);
  }

  OnMousedown(e: any) {
 //   this._contextLayer.selectItem(e, this._clientArea);
//    this.DrawActive();
//    this._contextLayer.Select(e, this._clientArea);
  }

  OnMouseUp(e: any) {
  //  this._contextLayer.mouseRelease();
   // return this._contextLayer.mouseRelease();
  }

  OnMouseOut(e: any) {
  //  this._contextLayer.releaseSelectedItem();
    return this._contextLayer.mouseRelease();
  }

  //OnMouseMove(e: any) {

  //  this._contextLayer.mouseMove(e, this._clientArea);
  //  this.Draw();
  //}

  setSize() {
    let parent: any = (<Element>this.TheCanvas.parentNode);
    parent = parent.parentElement;
    while (parent.localName != 'mat-grid-tile') {
      parent = parent.parentElement;
    }

 //   let styles = getComputedStyle(parent);
    let w = parent.offsetWidth || parent.clientWidth; // bug in typescript?  They do exist...
    let h = parent.offsetHeight || parent.clientHeight;

    this.TheCanvas.width = w;
    this.TheCanvas.height = h - 5;
    this.TopCanvas.width = this.TheCanvas.width;
    this.TopCanvas.height = this.TheCanvas.height;
    DisplayValues.width = this.TheCanvas.width;
    DisplayValues.height = this.TheCanvas.height;
    //if (this.initialLayer) {
    //  this.initialLayer.Init();
    //}
    let area = this.TheCanvas.getBoundingClientRect();
    this._clientArea = new Rectangle('activeBoundingArea', area.top, area.left, area.width, area.height,'DefaultBG');
  //  this._timeSpanLayer.resetArea(this._clientArea);

    this._contextLayer = this.canvasService.GetContextLayer(this.layerName, this._clientArea);
 //   this._actionLayer = new EventContextLayer(this.layerName + '_actionLayer', 'sss','sss');
 //   this.Draw();
 //   this._contextLayer.DrawSizer(this._context);
    this._contextLayer.Draw(this._context,true);
 }

  //DrawActive() {
  //  this.DrawStatic();
  //  this._contextLayer.DrawActive(this.TopContext);
  //}

  Draw() {
    this._contextLayer.Draw(this._context);
    //let self = this;
    //if (this._timeSpanLayer.Hit) {
    //  this._timeSpanLayer.Draw(self._context);
    //}
    //else {
    //  let lyrs = this._contextSystem.Layers;
    //  lyrs.forEach((l, i) => { l.Draw(self._context); });
    //}

    //if (!this.canvasService.BaseSystem) { return; }
    //this.canvasService.DrawSystem(this.canvasID);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSize();
    //  this.ReDraw();
  }



}
