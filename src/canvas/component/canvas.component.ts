import { Component, ElementRef, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { ContextSystem, ContextLayer } from '../models/IContextItem';
import { ExperimentalLayer } from '../models/custom/layers/experimentalLayer';
//import { BarLayer } from '../models/custom/layers/charts/content/bars/verticalbars';
import { DisplayValues } from '../models/DisplayValues';
import { ChartLayer } from '../models/custom/layers/charts/chart.layer';
import { Area } from '../models/shapes/primitives/area';
import { Margin } from '../models/shapes/primitives/margin';
import { Size } from '../models/shapes/primitives/size';
import { Point } from '../models/shapes/primitives/point';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  @ViewChild('thiscanvas') CanvasComponent: ElementRef;
  @Input() canvasID: string = 'testCanvas';
  @Input() width: number = 200;
  @Input() height: number = 200;
  @Input() margin: Margin;
  @Input() system: ContextSystem; 
 // layers: ContextLayer[] = [];
 // private _system: ContextSystem;

  constructor() {}

  ngOnInit() {

  }

  get Context2D() {
    return (
      <HTMLCanvasElement>this.CanvasComponent.nativeElement)
      .getContext('2d');
  }
  ngAfterViewInit(): void {
    
    if ( !this.system ) {
      this.system = new ContextSystem();  // TODO: have default layer for this state.
    }
    this.system.Draw(this.Context2D);
  }
}
