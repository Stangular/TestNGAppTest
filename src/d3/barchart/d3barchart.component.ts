import { Component, OnInit, AfterViewChecked, Inject, Input } from '@angular/core';
import { D3Service } from '../services/d3.service'

@Component({
  selector: 'd3barchart',
  templateUrl: './d3barchart.component.html'
})
export class D3BarchartComponent implements OnInit, AfterViewChecked {

  @Input() offsetX: number = 0;
  @Input() offsetY: number = 0;
  @Input() chartID: string = '';
  @Input() chartWidth: number = 200;
  @Input() chartHeight: number = 200;
  drawn: boolean = false;

  constructor(private d3Service: D3Service) { }

  ngOnInit() { }

  ngAfterViewChecked() {
    if (!this.drawn) {
      console.error('B:' + this.chartID);
   //   this.d3Service.DrawComponent(this.chartID, "bar", this.chartWidth, this.chartHeight, this.offsetX, this.offsetY);
      this.drawn = true;
    }
  }
  clicked(event: any) {

  }
}
