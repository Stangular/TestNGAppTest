import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSelect } from '@angular/material';
import { DisplayValues } from 'src/canvas/models/DisplayValues';
import { LineService } from 'src/canvas/models/lines/service/line.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Line, lineTypes, PortPath } from 'src/canvas/models/lines/line';
import { PathService } from 'src/canvas/models/shapes/service/path.service';
import { Path } from 'src/canvas/models/lines/path';
import { CanvasService } from 'src/canvas/service/canvas.service';
import { ILine } from 'src/canvas/models/lines/ILine';
import { AcknowlegeDeleteDialog } from '../acknowledgeDelete/acknowledge-delete-dialog.component';

export interface LineData {
  name: string;
  type: lineTypes;
  paths: PortPath[];
  state: string;
}
const LineTypessss = [
  { namex: "Straight", valuex: 0},
  { namex: "Gradient", valuex: 1},
  { namex: "Bezier", valuex: 2},
  { namex: "Vertical to Vertical", valuex: 10},
  { namex: "Horizontal to Horizontal", valuex: 11},
  { namex: "Vertical to Horizontal", valuex: 12},
  { namex: "Horizontal to Vertical", valuex: 13}
]
@Component({

  selector: 'line-update-dialog',
  templateUrl: 'update-line-dialog.component.html',
  styleUrls: ['update-line-dialog.component.css']
})
export class UpdateLineDialog implements OnInit {
  lineTypesss = LineTypessss;
  lineType: string = "Straight";
  lt = lineTypes;
  savedLineSelected: boolean = false;
  selectedColor: string = '';
  @Input() cancelMessage: string = 'Cancel';
  @Input() okMessage: string = 'Save';
  lines: Observable<ILine[]>;
  paths: Observable<PortPath[]>;
  pathName = new FormControl();
  lineName = new FormControl();
  lineState = "greenState";
  stateName = '';
  selectedType = "0";
  constructor(
    public lineService: LineService,
    public canvasService: CanvasService,
    public pathService: PathService,
    public dialogRef: MatDialogRef<UpdateLineDialog>,
    @Inject(MAT_DIALOG_DATA) public data: LineData
    , public dialog: MatDialog) {
    this.data.paths = [];
    this.data.type = lineTypes.straight;
    this.data.state = '';
  }

  onNoClick(): void {
    this.dialogRef.close();
    
  }

  get States() {
    return DisplayValues.StateNames;
  }
  //get States() {
  //  return DisplayValues.StateNames;
  //}
  ngOnInit() {
    this.lines = this.lineName.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterLine(value))
      );

    this.paths = this.pathName.valueChanges
      .pipe(startWith(''),
        map(value => this._filterPath(value))
      );
  }

  public _filterPath(value: string): PortPath[] {

    const v = value.toLowerCase().trim();
    if (v.length <= 0) { return this.data.paths; }
    return this.data.paths
      .filter(option => option.Id.toLowerCase().indexOf(v) >= 0);

  }
  LineSelected() {
    this.SetSelectedLineType();
  }

  SetSelectedLineType() {
    let type = lineTypes.straight;
    let line = this.canvasService.BaseSystem.Lines.find(l => l.Id == this.lineName.value);
    if (line) {
      type = line.Type;
      this.lineState = DisplayValues.GetColorStateName(line.State.color);
    }
    this.data.type = type;
    this.stateName = this.data.state;
  switch (type) {
      case lineTypes.gradient: this.selectedType = "1"; break;
      case lineTypes.bezier: this.selectedType = "2"; break;
      case lineTypes.VtoV: this.selectedType = "3"; break;
      case lineTypes.HtoH: this.selectedType = "4"; break;
      case lineTypes.VtoH: this.selectedType = "5"; break;
      case lineTypes.HtoV: this.selectedType = "6"; break;
      default: this.selectedType = "0"; break;
   }
    return type;
  }

  get ValidLineName() {
    return this.lineName
      && this.lineName.value
      && this.lineName.value.length > 4;
  }

  get ValidPathName() {
    return this.pathName
      && this.pathName.value
      && this.pathName.value.length > 4;

  }

  get LineSaved() {
    return this.savedLineSelected;
  }

  get PathNameSaved() {
    return this.data.paths.findIndex(p => p.Id == this.pathName.value) >= 0;
  }

  AddPath() {
    this.data.paths.push(new PortPath(this.pathName.value, this.lineName.value));
  }

  RemoveLine() {
    this.acknowledgeDelete();
  }

  private _filterLine(value: string): ILine[] {

    const v = value.toLowerCase();
 
    this.data.name = value;
    this.data.paths = [];
    this.data.state = this.States[0];
    this.data.type = lineTypes.straight;
    this.savedLineSelected = false;
    let list = this.canvasService.BaseSystem.Lines
      .filter(option => option.Id.toLowerCase().indexOf(v) >= 0);
    if (list.length == 1 && list[0].Id == value) {
      this.data.paths = this.canvasService.BaseSystem.Paths.filter(p => p.LineId == value);
      this.data.state = list[0].StateName;
      this.data.type = list[0].Type;
      this.savedLineSelected = true;
    }
    if (list.length <= 0) {
      return this.canvasService.BaseSystem.Lines;
    }
    return list;
  }


  OnStateChange(selection: MatSelect) {
    this.data.state = selection.value;
  }

  acknowledgeDelete(): void {
    const dialogRef = this.dialog.open(AcknowlegeDeleteDialog, {
      width: '250px',
      data: { result: 'remove', why: '', question: 'Gonna lose it!' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if ('remove' == result.result) {
        this.canvasService
          .BaseSystem.RemoveLine(this.data.name);
        this.data.name = "";
        this.data.paths = [];
   //     this.data.state = this.States[0];
        this.data.type = lineTypes.straight;
        this.savedLineSelected = false;
      }
    });
  }
}
