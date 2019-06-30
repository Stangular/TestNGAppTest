import { Component, Inject, Input,OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DisplayValues } from 'src/canvas/models/DisplayValues';
import { LineService } from 'src/canvas/models/lines/service/line.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Line, lineTypes } from 'src/canvas/models/lines/line';
import { PathService } from 'src/canvas/models/shapes/service/path.service';
import { Path } from 'src/canvas/models/lines/path';

export interface LineData {
  name: string;
  type: lineTypes;
  path: string;
  state: string;
}

@Component({
  selector: 'line-update-dialog',
  templateUrl: 'update-line-dialog.component.html',
  styleUrls: ['update-line-dialog.component.css']
})
export class UpdateLineDialog implements OnInit {
  lt = lineTypes;
  selectedColor: string = '';
  selectedState: string = "";
  lintType = '';
  @Input() cancelMessage: string = 'No';
  @Input() okMessage: string = 'Ok';
  lines: Observable<Line[]>;
  paths: Observable<Path[]>;
  pathName = new FormControl();
  lineName = new FormControl();
  states: string[];
  constructor(
    public lineService: LineService,
    public pathService: PathService,
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
      map(value => this._filterLine(value))
    );

    this.paths = this.pathName.valueChanges
      .pipe(startWith(''),
      map(value => this.PathFilter(value))
    );
    this.pathName.setValue(this.data.path);
  }

  private PathFilter(value: string) {
    let res = this.pathService.Filter(value);
    this.data.path = this.pathService._selectedPathName;
    return res;
  }

  SelectLineType(typeinfo: any) {
    let sss = 0;
  }

  private _filterLine(value: string): Line[] {

    const v = value.toLowerCase();
    if (v.length <= 0) { return [];}
    this.data.name = value;
    this.data.state = this.selectedState;
    return this.lineService
      ._lines
      .filter(option => option.Id.toLowerCase().indexOf(v) >= 0);
  }

  
}
