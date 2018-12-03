import { Component, OnInit, AfterContentInit, AfterViewChecked, Input } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { D3Service } from '../services/d3.service'
@Component({
  selector: 'd3linechart',
  templateUrl: './d3linechart.component.html',
  styleUrls: ['./d3linechart.component.css']
})
export class D3LinechartComponent implements OnInit, AfterViewChecked {

  form: FormGroup;

  @Input() chartID: string = '';
  @Input() chartWidth: number = 200;
  @Input() chartHeight: number = 200;

  drawn: boolean = false;

  constructor(private d3Service: D3Service) { }

  ngOnInit() {
    this.InitForm();
  }

  InitForm(): FormGroup {
    return this.form;
  }

  ngAfterViewChecked() {
    if (!this.drawn) {
      console.error('B:' + this.chartID);
   //   this.d3Service.DrawComponent(this.chartID, "line", this.chartWidth, this.chartHeight);
      this.drawn = true;
    }
  }

  clicked(event: any) {

  }
}



