import { Component, Inject,OnInit } from '@angular/core';
import {  MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  result: string;
  why: string;
  question: string;
}

@Component({
  selector: 'app-canvas-shape-property-dialog',
  templateUrl: './canvas-shape-property-dialog.component.html',
  styleUrls: ['./canvas-shape-property-dialog.component.css']
})
export class CanvasShapePropertyDialogComponent  {
  constantArea: boolean = false;
  freedomOfSizing

  constructor(public dialogRef: MatDialogRef<CanvasShapePropertyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
   
}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
