import { Component, Inject,OnInit } from '@angular/core';
import {  MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DisplayValues } from 'src/canvas/models/DisplayValues';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface GraphicData {
  weight: number;
  color: string;
  state: string;
}

@Component({
  templateUrl: './canvas-graphic-state-dialog.component.html',
  styleUrls: ['./canvas-graphic-state-dialog.component.css']
})
export class CanvasGraphicStateDialogComponent implements OnInit {
  weight: number = 1;
  color: string = '';
  constantArea: boolean = false;
  states: Observable<string[]>;
  stateName = new FormControl();

  constructor(public dialogRef: MatDialogRef<CanvasGraphicStateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GraphicData) {}

  ngOnInit() {
    this.states = this.stateName.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.data.state = value;
    let ndx = DisplayValues.GetColorIndex(value);
    if (ndx < 0) {
      this.data.color = "#000000";
    }
    else {
      this.data.color = DisplayValues.GetColor(ndx);
    }
    ndx = DisplayValues.GetWeightIndex(value);
    if (ndx < 0) {
      this.data.weight = 1;
    }
    else {
      this.data.weight = DisplayValues.GetWeight(ndx);
    }
    return DisplayValues.StateNames.filter(option => option.toLowerCase().includes(filterValue));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
