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
import { ContextSystem, ContextLayer, ActionLayer } from '../../../models/IContextItem';
import { ExperimentalLayer } from '../../../models/custom/layers/experimentalLayer';
//import { BarLayer } from '../models/custom/layers/charts/content/bars/verticalbars';
import { DisplayValues } from '../../../models/DisplayValues';
import { ChartLayer } from '../../../models/custom/layers/charts/chart.layer';
import { Area } from '../../../models/shapes/primitives/area';
import { Margin } from '../../../models/shapes/primitives/margin';
import { Size } from '../../../models/shapes/primitives/size';
import { Point } from '../../../models/shapes/primitives/point';
import { ShapeSelectResult } from '../../../models/shapes/shapeSelected';
import { Records } from 'src/dataManagement/model/records';
import { MessageService } from 'src/app/messaging/message.service';
import { Subscription } from 'rxjs';
import { EditModel, BaseDesignerModel } from '../../../models/designer/base.model';
import { CanvasService } from '../../../service/canvas.service';
import { Action } from 'rxjs/internal/scheduler/Action';


export class CanvasContextModel {
  size: Size = new Size();
  data: any;

  constructor() { }
}

@Component({
  selector: 'edit-canvas',
  templateUrl: './editCanvas.component.html',
  styleUrls: ['./editCanvas.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class EditCanvasComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck {

  _staticLayer: ContextLayer;
  _actionLayer: ActionLayer;
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
  @Output() Select: EventEmitter<ShapeSelectResult> = new EventEmitter<ShapeSelectResult>();
  @Output() edit: EventEmitter<ShapeSelectResult> = new EventEmitter<ShapeSelectResult>();
  @Output() move: EventEmitter<ShapeSelectResult> = new EventEmitter<ShapeSelectResult>();
  private point: Point = new Point();
  constructor(private messageService: MessageService, public canvasService: CanvasService) {

    this.subscription = this.messageService.getMessage().subscribe(
      message => { this.AcceptMessage(message) });

 //   this._actionLayer = new ActionLayer('editor');
    this._staticLayer = this.canvasService.BaseSystem.getLayer(this.canvasID);
  }

  AcceptMessage(message: any) {
    switch (message.text) {
      case 11: break;
      case 10: this.editSystem.Draw(this.ActiveContext); break;
      case 1015:
        this.onResize(null);
        this.Draw();
        break;
      case 1001:
        this.Draw();
        break;
    }
  }

  ngOnInit() {
  //  this.canvasService.ContextModel.AddLayerContext('editor', this.ActiveContext);
  //  this.canvasService.ContextModel.AddLayerContext(this.canvasID, this.StaticContext);
    this._actionLayer.SetLayer(this.canvasService.BaseSystem.getLayer(this.canvasID));
 //   this.Draw();
 //  this._actionLayer.Reset(this.canvasService.ContextModel);
}

  get StaticCanvas() {
    return <HTMLCanvasElement>this.staticCanvas.nativeElement;
  }

  get ActiveCanvas() {
    if (!this.canvasService.EditOn || !this.activeCanvas) {
      return null;
    }
    return <HTMLCanvasElement>this.activeCanvas.nativeElement;
  }

  ngDoCheck() {
    if (this.canvasService.EditOn) {
      setTimeout(() =>
        this.setSize()
        , 10);
    }
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

  }

  get StaticContext() {
    return this.StaticCanvas.getContext('2d');
  }

  get ActiveContext() {
    if (!this.canvasService.EditOn) { return null; }
    return this.ActiveCanvas.getContext('2d');
  }

  get ClientArea() {
    return this.StaticCanvas.getBoundingClientRect();
  }

  PositionFromEvent(e: any) {
    let rect = this.StaticCanvas.getBoundingClientRect();
    this.canvasService.SSR.PositionFromEvent(e, rect);
  }

  private Clear() {
    this.StaticContext.clearRect(0, 0, this.StaticCanvas.width, this.StaticCanvas.height);
    this.ActiveContext.clearRect(0, 0, this.ActiveCanvas.width, this.ActiveCanvas.height);
  }

  CopySelectedContent() {
    let itemId = this.canvasService.shapeSelectResult.id;
    this.system.CopyItem(itemId);
  }

  RemoveSelectedContent() {
    this.system.RemoveContentById(this.canvasService.shapeSelectResult.id);
    this.canvasService.shapeSelectResult.id = "";
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

  OnMousedown(e: any) {

    this.PositionFromEvent(e);
    if (this.canvasService.EditOn) {
      let selected = this._actionLayer.ShapeSelected;
      this.Clear();
      if (this._actionLayer.Select(this.canvasService.SSR.point)) {
        this.Draw();
      }
      else if (!selected) {
        this._actionLayer.AddNewContent(this.canvasService.SSR);
        this.Draw();
      }
  //    this._actionLayer.Reset(this.canvasService.ContextModel);
      this.canvasService.SetActiveShape(this._actionLayer.SelectedShape);
      this.Select.emit(this.canvasService.SSR);
    }
  }

  OnRelease(e: any) {
    this.canvasService.SSR.itemCaptured = false;
  }

  OnMouseMove(e: any) {

    if (this.canvasService.SSR.itemCaptured) {

      this.PositionFromEvent(e);
   //   this._actionLayer.MoveItem(this.canvasService.ContextModel, this.canvasService.SSR);
      this.Draw();
      this.move.emit(this.canvasService.shapeSelectResult);
    }
  }

  setSize() {
    let parent: any = (<Element>this.StaticCanvas.parentNode);
    parent = parent.parentElement;
    if (!parent) { return; }
    while (parent.localName != 'mat-grid-tile') {
      parent = parent.parentElement;
    }

    let styles = getComputedStyle(parent);
    let w = parent.offsetWidth || parent.clientWidth; // bug in typescript?  They do exist...
    let h = parent.offsetHeight || parent.clientHeight;
    w = w - 2;
    h = h - 5;
    if (w != this.StaticCanvas.width
      || h != this.StaticCanvas.height) {
      this.StaticCanvas.width = w;
      this.StaticCanvas.height = h;
      if (this.ActiveCanvas) {
        this.ActiveCanvas.width = this.StaticCanvas.width;
        this.ActiveCanvas.height = this.StaticCanvas.height;
      }
      this.Draw();
  //    this._actionLayer.Reset(this.canvasService.ContextModel);

     // this._staticLayer.Draw(this.canvasService.ContextModel);
    }

  }

  Draw() {
    //  if (!this.canvasService.BaseSystem) { return; }
  //  this.canvasService.ContextModel.SetLayerContext('editor', this.ActiveContext);
 //   this._actionLayer.Draw(this.canvasService.ContextModel);
  //  this.canvasService.ContextModel.SetLayerContext(this.canvasID, this.StaticContext);
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
