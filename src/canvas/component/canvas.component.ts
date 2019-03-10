import {
  Component,
  ElementRef,
  OnInit,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnDestroy
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


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  shapeSelectResult: ShapeSelectResult = new ShapeSelectResult();
  @Input() source: Records<string>;
  @ViewChild('thiscanvas') CanvasComponent: ElementRef;
  @Input() canvasID: string = 'testCanvas';
  @Input() width: number = 200;
  @Input() height: number = 200;
  @Input() margin: Margin;
  @Input() system: ContextSystem;
  @Output() select: EventEmitter<ShapeSelectResult> = new EventEmitter<ShapeSelectResult>();

  private point: Point = new Point();

  constructor(private messageService: MessageService) {
    this.subscription = this.messageService.getMessage().subscribe(message => { this.Draw(); });
  }

  ngOnInit() {}

  get Canvas() {
    return <HTMLCanvasElement>this.CanvasComponent.nativeElement;
  }

  get Context2D() {
    return (
      this.Canvas.getContext('2d'));
  }

  ngAfterViewInit(): void {
    this.Draw();
  }

  OnClick(e: any) {
    let rect = this.Canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    console.log("x: " + x + " y: " + y);
    this.point.SetToPosition(x, y);
    this.shapeSelectResult.point.SetToPosition(x, y);
    this.shapeSelectResult.id = "";
    if (this.system.SelectShape(this.shapeSelectResult))
    {
      this.select.emit(this.shapeSelectResult);
    }
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
}
