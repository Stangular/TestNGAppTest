import { Component, Inject, OnInit,Input } from '@angular/core';



@Component({
  selector: 'wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.css']
})
export class WaitComponent {
  @Input() Width = 50;
  @Input() Height = 50;
  @Input() SpinnerDiameter = 150
  @Input() Message = 'Loading...'
  constructor() {}


  get XOffset() {
    return this.Width / 2 - this.SpinnerDiameter / 2; 
  }

  get YOffset() {
    return this.Height / 2 - this.SpinnerDiameter / 2; 

  }


}
