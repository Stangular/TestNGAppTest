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
import { ContextSystem, ContextLayer } from '../../../models/IContextItem';
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

  mouseCaptured: boolean = false;
  subscription: Subscription;
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() system: ContextSystem;
  @Input() editSystem: EditModel;
  @Input() id: string = '';
  @Input() source: Records<string>;
  @ViewChild('theCanvas') theCanvas: ElementRef;
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
      case 1015:
      case 1001:
        this.onResize(null);
        this.Draw(); break;
      //   default: this.ReDraw(); break;
    }
  }
  ngOnInit() { }

  get TheCanvas() {
    return <HTMLCanvasElement>this.theCanvas.nativeElement;
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
    return this.TheCanvas.getContext('2d');
  }

  get ClientArea() {
    return this.TheCanvas.getBoundingClientRect();
  }

  PositionFromEvent(e: any) {
    let rect = this.TheCanvas.getBoundingClientRect();
    this.canvasService.SSR.PositionFromEvent(e, rect);
  }

  private Clear() {
    this.StaticContext.clearRect(0, 0, this.TheCanvas.width, this.TheCanvas.height);
  }

  OnMousedown(e: any) {
    this.PositionFromEvent(e);
    if (this.canvasService.EditOn) {
      this.canvasService.Select();
      this.Clear();
      this.canvasService.DrawSystem(this.canvasID);
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
     this.canvasService.AddLayer();
  }

  OnRelease(e: any) {
    this.canvasService.SSR.itemCaptured = false;
  }

  OnMouseMove(e: any) {
    if (this.canvasService.SSR.itemCaptured) {

      this.PositionFromEvent(e);
      this.canvasService.MoveSystem();
      this.canvasService.DrawSystem(this.canvasID);
      this.move.emit(this.canvasService.shapeSelectResult);
    }
  }

  setSize() {
    let parent: any = (<Element>this.TheCanvas.parentNode);
    parent = parent.parentElement;
    while (parent.localName != 'mat-grid-tile') {
      parent = parent.parentElement;
    }

    let styles = getComputedStyle(parent);
    let w = parent.offsetWidth || parent.clientWidth; // bug in typescript?  They do exist...
    let h = parent.offsetHeight || parent.clientHeight;

    this.TheCanvas.width = w - 2;
    this.TheCanvas.height = h - 5;
   
    this.Draw();
  }

  Draw() {
    if (!this.canvasService.BaseSystem) { return; }
    this.canvasService.DrawSystem(this.canvasID);
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
