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
export class ActionCanvasComponent implements OnInit, AfterViewInit, OnDestroy {

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
  @Input() canvasID: string = 'testCanvas';
  @Input() margin: Margin;
  private _clientArea: Rectangle = null;
  _contextLayer: EventContextLayer;
  _autoUpdate = false;
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
    }
  }

  ngOnInit() { }

  InitCanvas(inputData: any): Promise<any> {
    return this._contextLayer.LoadCanvasData(inputData);
  }

  UpdateCanvas(inputData: any) {
    this._contextLayer.UpdateCanvasData(inputData);
    this._contextLayer.Draw(this._context);
  }

  get ContextLayer() {
    return this._contextLayer;
  }

  get ClientArea() {
    return this._clientArea;
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

  ngAfterViewInit(): void {
    this._context = this.TheContext;
    this._activeContext = this.TopContext;
    DisplayValues.SetContextItems(this._context);
    setTimeout(() =>
      this.setSize()
      , 10);
  }

  PositionFromEvent(e: any) {
    let rect = this.TheCanvas.getBoundingClientRect();
    this.canvasService.SSR.PositionFromEvent(e, rect);
  }

  RunAutoUpdate() {
    this._autoUpdate = this._contextLayer.AutoUpdate();
    if (this._autoUpdate) {
      this._context.save();
      this.Draw();
      this._context.restore();

      setTimeout(() =>
        this.RunAutoUpdate()
        , 10);
    }
  }

  Clear() {
    this.TopContext.clearRect(
      0,
      0,
      this._clientArea.Width,
      this._clientArea.Height);
  }

  OnMouseDown(e: PointerEvent) {

    this.Clear();
    this._contextLayer.selectItem(e, this.TopContext);
 //   this._contextLayer.Draw(this._context);
    this.TopCanvas.setPointerCapture(e.pointerId);
    this._contextLayer.Draw(this._context);

  }

  OnMouseUp(e: any) {
    this.Clear();
    this._contextLayer.releaseSelectedItem(e,this._context);
    this.TopCanvas.releasePointerCapture(e.pointerId);
    this._contextLayer.Draw(this._context);

  }

  OnMouseOver(e: any) {
    //if (this._mouseOut) {
    //  e.srcElement.dispatchEvent(new Event("mouseup"));
    //  e.srcElement.dispatchEvent(new Event("mousedown"));
    //  e.srcElement.dispatchEvent(new Event("mouseup"));
    //  this._mouseOut = false;
    //}
  }

  OnMouseOut(e: any) {
    //  e.srcElement.dispatchEvent(new Event("mouseup"));
    // this._mouseOut = true;
  }

  OnMouseMove(e: any) {
    this._contextLayer.mouseMove(e, this.TopContext);
    if (!this._autoUpdate) {
      setTimeout(() =>
        this.RunAutoUpdate()
        , 10);
    }
  }

  setSize() {
    let parent: any = (<Element>this.TheCanvas.parentNode);
    parent = parent.parentElement;
    while (parent.localName != 'mat-grid-tile') {
      parent = parent.parentElement;
    }

    let w = parent.offsetWidth || parent.clientWidth; // bug in typescript?  They do exist...
    let h = parent.offsetHeight || parent.clientHeight;

    this.TheCanvas.width = w;
    this.TheCanvas.height = h - 5;
    this.TopCanvas.width = this.TheCanvas.width;
    this.TopCanvas.height = this.TheCanvas.height;
    DisplayValues.width = this.TheCanvas.width;
    DisplayValues.height = this.TheCanvas.height;
    let area = this.TheCanvas.getBoundingClientRect();
    this._clientArea = new Rectangle('activeBoundingArea', area.top, area.left, area.width, area.height, 'boundingArea');
    if (!this._contextLayer) {
      this._contextLayer = this.canvasService.GetContextLayer(this.layerName, this._clientArea,this._context);
    }
    else {
      this._contextLayer.Resize(this._clientArea);
    }
    this._contextLayer.Draw(this._context, true);
  }

  Draw() {
    this._contextLayer.Draw(this._context);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSize();
  }

  @HostListener('window:pointerup', ['$event'])
  onPointerUp(event) {
    this.OnMouseUp(event);
  }

  @HostListener('window:pointermove', ['$event'])
  onPointerMove(event) {
    this.OnMouseMove(event);
  }



}
