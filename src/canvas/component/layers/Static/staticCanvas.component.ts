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

export class CanvasContextModel {
  size: Size = new Size();
  data: any;

  constructor() { }
}

@Component({
  selector: 'static-canvas',
  templateUrl: './staticCanvas.component.html',
  styleUrls: ['./staticCanvas.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class StaticCanvasComponent implements OnInit, AfterViewInit, OnDestroy {

  mouseCaptured: boolean = false;
  subscription: Subscription;
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Input() system: ContextSystem;
  @Input() editSystem: EditModel;
  @Input() id: string = '';
  @Input() canvasID: string = '';

  @Input() source: Records<string>;
  @ViewChild('staticcanvas') theCanvas: ElementRef;
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
      case 1015:
        this.onResize(null);
        this.Draw();
        break;
      case 1001:
        this.canvasService.ContextModel.AddLayerContext(this.canvasID, this.TheContext);
        this.onResize(null);
        this.Draw(); break;
    }
  }

  ngOnInit() {
    this.canvasService.ContextModel.AddLayerContext(this.canvasID, this.TheContext);
    this.setSize();
  }

  get TheCanvas() {
    return <HTMLCanvasElement>this.theCanvas.nativeElement;
  }

  ngAfterViewInit(): void {
    setTimeout(() =>
      this.setSize()
      , 10);

  }

  get TheContext() {
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
    this.TheContext.clearRect(0, 0, this.TheCanvas.width, this.TheCanvas.height);
  }

  setSize() {
    let parent: any = (<Element>this.TheCanvas.parentNode);
    parent = parent.parentElement;
    while (parent.localName != 'mat-grid-tile') {
      parent = parent.parentElement;
    }

    let w = parent.offsetWidth || parent.clientWidth || 800; // bug in typescript?  They do exist...
    let h = parent.offsetHeight || parent.clientHeight || 400;

    this.TheCanvas.width = w - 2;
    this.TheCanvas.height = h - 5;
 
    this.Draw();
  }

  Draw() {
    this.canvasService.ContextModel.SetLayerContext(this.canvasID, this.TheContext);

    this.canvasService.DrawSystem(this.canvasID);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setSize();
  }
}
