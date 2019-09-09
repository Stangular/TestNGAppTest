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
export class CanvasComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges, DoCheck{

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
    switch (message.text) {
      case 11: break;
      case 10: this.editSystem.Draw(this.ActiveContext); break;
      case 1001: this.Draw(); break;
   //   default: this.ReDraw(); break;
    }
  }
  ngOnInit() {}

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
    setTimeout(() =>
      this.SetActiveLayer()
      , 10);

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
    this.canvasService.SSR.PositionFromEvent(e,rect);
  }

  private Clear() {
    this.StaticContext.clearRect(0,0,this.StaticCanvas.width, this.StaticCanvas.height);
    this.ActiveContext.clearRect(0,0,this.ActiveCanvas.width, this.ActiveCanvas.height);
  }

  OnMousedown(e: any) {
    this.PositionFromEvent(e);
    if (this.canvasService.EditOn) {
      this.canvasService.Select();
      this.Clear();
      this.canvasService.BaseSystem.Draw(this.StaticContext, this.ActiveContext);
    }
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
    this.Draw();
  }
  
  Draw() {
    if (!this.canvasService.BaseSystem) { return; }
    this.canvasService.BaseSystem.Draw(this.StaticContext, this.ActiveContext);
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
