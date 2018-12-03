import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { D3BarchartComponent } from './barchart/d3barchart.component';
import { D3PiechartComponent } from './piechart/d3piechart.component';
import { D3LinechartComponent } from './linechart/d3linechart.component';
import { D3SVGElementComponent } from './SVGElement/SVGElement.component';
import { D3Service } from './services/d3.service';


@NgModule({
  imports: [
    CommonModule
  ],

  declarations: [
    D3BarchartComponent
    , D3PiechartComponent
    , D3LinechartComponent
    , D3SVGElementComponent
  ],
  exports: [
    D3BarchartComponent
    , D3PiechartComponent
    , D3LinechartComponent
    , D3SVGElementComponent],

  providers: [D3Service]
})

export class d3Module { }
