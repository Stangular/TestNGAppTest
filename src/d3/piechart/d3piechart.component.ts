import { Component, OnInit, AfterViewChecked, Input } from '@angular/core';
import { D3Service } from '../services/d3.service'

@Component({
  selector: 'd3piechart',
  templateUrl: './d3piechart.component.html'
})
export class D3PiechartComponent implements OnInit, AfterViewChecked {
  @Input() chartID: string = '';
  @Input() chartWidth: number = 200;
  @Input() chartHeight: number = 200;
  @Input() formName: string = '';
  drawn: boolean = false;

  constructor(private d3Service: D3Service) { }

  ngOnInit() {
  
  }

  ngAfterViewChecked() {
    if (!this.drawn) {
   //   this.d3Service.DrawComponent(this.chartID, "pie", this.chartWidth, this.chartHeight);
      this.drawn = true;
    }
  }

  clicked(event: any) {

  }
}
