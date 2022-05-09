import { Component, Input } from '@angular/core';
import { contentRow } from './contentGrid.component';

@Component({

  selector: 'content-row',
  templateUrl: './contentRow.component.html',
  styleUrls: ['./contentRow.component.css']
})
export class ContentRowComponent {
  @Input() columnColor: string[] = [];
  @Input() data: contentRow;
  @Input() row: number = 0;
//  tempdata: number[] = [1, 2, 3, 4, 6, 7, 8,9,10,11,12,13];

  constructor() { }

  
}

