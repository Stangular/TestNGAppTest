import {
  Component,
  ElementRef,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
  OnChanges
} from '@angular/core';
import { ContextSystem, ContextLayer, EventContextLayer, IDataResult } from '../../../models/IContextItem';
import { Margin } from '../../../models/shapes/primitives/margin';
import { Size } from '../../../models/shapes/primitives/size';
import { Records } from 'src/dataManagement/model/records';
import { MessageService, InformationExchange } from 'src/app/messaging/message.service';
import { Subscription } from 'rxjs';
import { EditModel } from '../../../models/designer/base.model';
import { CanvasService } from '../../../service/canvas.service';
import { DisplayValues } from 'src/canvas/models/DisplayValues';
import { Rectangle } from 'src/canvas/models/shapes/rectangle';
import { AreaSizer } from 'src/canvas/models/shapes/sizing/sizer';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

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
  @ViewChild('touchCanvas') touchCanvas: ElementRef;
  @ViewChild('staticCanvas') theCanvas: ElementRef;
  @Input() canvasID: string = 'testCanvas';
  @Input() margin: Margin;
  private _clientArea: Rectangle = null;
  _contextLayer: EventContextLayer;
  _autoUpdate = false;
  _context: CanvasRenderingContext2D;
  _activeContext: CanvasRenderingContext2D;
  //@Input() set dateChanged(change: any) {
  //  if (this._contextLayer) {
  //    try {
  //      let dx = this.canvasService.DateChange;
  //      this._contextLayer.SetDataResult(dx);
  //    }
  //    catch (ex) {
  //      let sss = 0;
  //    }
  //    this._context.clearRect(
  //      0,
  //      0,
  //      this._clientArea.Width,
  //      this._clientArea.Height);
  //    this.Draw();
  //    //   this._contextLayer.Draw(this.TouchContext);
  //  }
  //}
  @Input() set dataChanged(changeType: any) {
    if( this._contextLayer ){
  //    this._contextLayer.SetDataResult(this.canvasService.DataResultChange, changeType);
      this._context.clearRect(
        0,
        0,
        this._clientArea.Width,
        this._clientArea.Height);
      this.Draw();
   //   this._contextLayer.Draw(this.TouchContext);
    }
 
  }

  get dataChanged(): any {
    return false;
  }
 // @output()
  constructor(private messageService: MessageService, public canvasService: CanvasService) {

    this.subscription = this.messageService.getMessage().subscribe(
      message => { this.AcceptMessage(message) });


  }

  AcceptMessage(message: any) { //InformationExchange
    switch (message.info.ID) {
      case '11': break;
      case '1015':
      case '1001':
        this.onResize(null);
        break;
      case '20000' :
        this.canvasService.setExternalDataExchange( message.info.Data );
        this._contextLayer.SetDataResult(message.info.Data as IDataResult,2);
        this._context.clearRect(
        0,
        0,
        this._clientArea.Width,
        this._clientArea.Height);
        this.Draw();
        break;

      case '20001':
        this.canvasService.setExternalDataExchange( message.info.Data );
        this._contextLayer.SetDataResult(message.info.Data as IDataResult, 0);
        this._context.clearRect(
          0,
          0,
          this._clientArea.Width,
          this._clientArea.Height);
        this.Draw();
        break;

    }
  }

  ngOnChanges(changes: any) {

    let sss = 0;
    //this.doSomething(changes.categoryId.currentValue);
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

  }


  ngOnInit() {}

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

  get TouchCanvas() {
    return <HTMLCanvasElement>this.touchCanvas.nativeElement;
  }

  get TheContext() {
    return this.TheCanvas.getContext('2d');
  }

  get TouchContext() {
    return this.TouchCanvas.getContext('2d');
  }

  
  set DataResultChange(data: any) {
    let sss = 0;
  }

  ngAfterViewInit(): void {
    this._context = this.TheContext;
    this._activeContext = this.TouchContext;
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
      this._context.clearRect(
        0,
        0,
        this._clientArea.Width,
        this._clientArea.Height);
      this._contextLayer.DrawStatic(this._context, false);
      this._context.restore();

      setTimeout(() =>
        this.RunAutoUpdate()
        , 100);
    }
  }

  Clear() {
    this.TouchContext.clearRect(
      0,
      0,
      this._clientArea.Width,
      this._clientArea.Height);
  }

  OnMouseDown(e: PointerEvent) {
    this.Clear();
    this._context.clearRect(
      0,
      0,
      this._clientArea.Width,
      this._clientArea.Height);
    this._contextLayer.selectItem(e, this._context);
    this.TouchCanvas.setPointerCapture(e.pointerId);

    this._contextLayer.DrawStatic(this._context, false);
    this._contextLayer.Draw(this.TouchContext, true);
  }

  OnMouseUp(e: any) {

    if (this._contextLayer) {
      this.Clear();
      this._contextLayer.releaseSelectedItem(e, this._context);
      this.TouchCanvas.releasePointerCapture(e.pointerId);
      this._contextLayer.Draw(this._context);
    }
  }

  OnMouseMove(e: any) {
    if (this._contextLayer) {
      this.Clear();
      this._contextLayer.mouseMove(e, this.TouchContext);
      this.canvasService.setExternalDataExchange(this._contextLayer.GetDataResult());
      this.RunAutoUpdate();
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
    this.TouchCanvas.width = this.TheCanvas.width;
    this.TouchCanvas.height = this.TheCanvas.height;
  //  this.TouchCanvas.C = this.TheCanvas.offsetLeft;
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
    this._contextLayer.Draw(this._context,false);
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
