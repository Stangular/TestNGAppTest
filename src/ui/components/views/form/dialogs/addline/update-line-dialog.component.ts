import { Component, Inject, Input,OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DisplayValues } from 'src/canvas/models/DisplayValues';
import { LineService } from 'src/canvas/models/lines/service/line.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Line } from 'src/canvas/models/lines/line';

export interface LineData {
  name: string;
  state: string;
}

@Component({
  selector: 'line-update-dialog',
  templateUrl: 'update-line-dialog.component.html',
  styleUrls: ['update-line-dialog.component.css']
})
export class UpdateLineDialog implements OnInit {
  selectedColor: string = '';
  selectedState: string = "";
  lintType = '';
  @Input() cancelMessage: string = 'No';
  @Input() okMessage: string = 'Ok';
  lines: Observable<Line[]>;
  lineName = new FormControl();
  states: string[];
  constructor(
    public lineService: LineService,
    public dialogRef: MatDialogRef<UpdateLineDialog>,
    @Inject(MAT_DIALOG_DATA) public data: LineData) {
    this.states = DisplayValues.StateNames;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.lines = this.lineName.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  SelectLineType(typeinfo: any) {
    let sss = 0;
  }

  private _filter(value: string): Line[] {
    const v = value.toLowerCase();
    if (v.length <= 0) { return [];}
    this.data.name = value;
    this.data.state = this.selectedState;
    return this.lineService
      ._lines
      .filter(option => option.Id.toLowerCase().indexOf(v) >= 0);
  }
}
