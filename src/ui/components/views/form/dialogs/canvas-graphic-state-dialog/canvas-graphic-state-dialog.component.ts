import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DisplayValues, NamedValue } from 'src/canvas/models/DisplayValues';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AcknowlegeDeleteDialog } from '../acknowledgeDelete/acknowledge-delete-dialog.component';
import { CanvasService } from 'src/canvas/service/canvas.service';

export interface GraphicData {
  weight: number;
  color: string;
  state: string;
  font: string;
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
  fonts: Observable<NamedValue<string>[]>;
  stateName = new FormControl();
  fontName = new FormControl();
  constructor(public canvasService: CanvasService,public dialogRef: MatDialogRef<CanvasGraphicStateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GraphicData
    , public dialog: MatDialog) { }

  ngOnInit() {
    this.states = this.stateName.valueChanges
      .pipe(
        startWith(''),
      map(value => this._filterState(value))
      );
    this.fonts = this.fontName.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterFonts(value))
    );
    this.canvasService.RetrieveState();

  }

  public get StateName() {
    return this.stateName.value || '';
  }

  private _filterFonts(value: string): NamedValue<string>[] {
    const filterValue = value.toLowerCase();
    this.data.font = value;
    return DisplayValues.Fonts.filter(option => option.Value.toLowerCase().includes(filterValue));
  }

  RemoveState() {
    this.acknowledgeDelete();
  //  DisplayValues.RemoveState(this.data.state);
   // this.stateName.setValue("");
  }

  public get StateIndex() {
    return DisplayValues.GetColorIndex(this.data.state);
  }

  private _filterState(value: string): string[] {

    const filterValue = value.toLowerCase();
    this.data.state = value;
    this.data.color = DisplayValues.GetColorFromValue(value);
    this.data.weight = DisplayValues.GetWeightFromValue(value);
    this.data.font = DisplayValues.GetFontFromValue(value);
    this.fontName.setValue(this.data.font);

    return DisplayValues.StateNames.filter(option => option.toLowerCase().includes(filterValue));
  }

  RemoveLine() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  acknowledgeDelete(): void {
    const dialogRef = this.dialog.open(AcknowlegeDeleteDialog, {
      width: '250px',
      data: { result: 'remove', why: '', question: 'Gonna lose it!' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if ('remove' == result.result) {
         DisplayValues.RemoveState(this.data.state);
         this.stateName.setValue("");
      }


    });
  }

}
