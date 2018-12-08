import { Component, ElementRef, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { ContextSystem, ContextLayer } from '../models/IContextItem';
import { ExperimentalLayer } from '../models/custom/layers/experimentalLayer';
//import { BarLayer } from '../models/custom/layers/charts/content/bars/verticalbars';
import { DisplayValues } from '../models/DisplayValues';
import { ChartLayer } from '../models/custom/layers/charts/chart.layer';

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
  @Input() layerName: string = '';
  layers: ContextLayer[] = [];
  private _system: ContextSystem;

  constructor() {
    //DisplayValues.SetValue('default_bg', 'red');
    //DisplayValues.SetValue('default_borderwidth', '1');
    //DisplayValues.SetValue('default_bordercolor', '1');
   // this.layers.push(new ExperimentalLayer());
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {

    switch (this.layerName) {
      case 'chart': this.layers.push(new ChartLayer(this.width,this.height,'myChart')); break;
      default: this.layers.push(new ExperimentalLayer()); break;
    }

    const context = (<HTMLCanvasElement>this.CanvasComponent.nativeElement).getContext('2d');

    this._system = new ContextSystem(context, this.layers);
    this._system.Draw();
  }
}
