import { Component, OnInit, AfterViewChecked, Input } from '@angular/core';
import { D3Service } from '../services/d3.service'
import { Size, Margin } from '../services/d3.common.model';

@Component({
  selector: 'd3svgItem',
  templateUrl: './SVGElement.component.html',
  styleUrls: ['./SVGElement.component.css']
})
export class D3SVGElementComponent implements OnInit, AfterViewChecked {

  margin: Margin = new Margin(0,0,0,0);
  size: Size = new Size(0,0);
  @Input() chartID: string = '';
  @Input() chartWidth: number = 200;
  @Input() chartHeight: number = 200;
  @Input() marginTop: number = 0;
  @Input() marginLeft: number = 0;
  @Input() marginRight: number = 0;
  @Input() marginBottom: number = 0;

  @Input() formName: string = '';
  drawn: boolean = false;

  constructor(private d3Service: D3Service) { }

  ngOnInit() {
 
  }

  Reset() {
    this.drawn = false;
  }

  ngAfterViewChecked() {
    if (!this.drawn) {
      console.error('B:' + this.chartID);
      this.size.Set(this.chartWidth, this.chartHeight);
      this.margin.Set(this.marginTop, this.marginRight, this.marginBottom, this.marginLeft);
      this.d3Service.SetViewParameters(this.chartID
        , this.margin
        , this.size);
      this.d3Service.DrawComponent(this.chartID);
      this.drawn = true;
    }
  }

  clicked(event: any) {

  }
}
