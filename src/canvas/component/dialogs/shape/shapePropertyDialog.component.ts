import {
  Component, Input, Output, EventEmitter, Inject
} from '@angular/core';
import { DisplayValues } from 'src/canvas/models/DisplayValues';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FreedomOfMotion, AreaType, Shape } from 'src/canvas/models/shapes/shape';
import { CanvasService, objectTypes } from 'src/canvas/service/canvas.service';
import { FormControl } from '@angular/forms';

export interface IShapeData {
  name: string;
  state: string;
  areaType: AreaType;
  freedomOfMotion: FreedomOfMotion;
  freedomOfSizing: FreedomOfMotion;
  width: number;
  height: number;
  cornerRadius: number;
}

@Component({
  selector: 'shape-property-dialog',
  templateUrl: './shapePropertyDialog.component.html',
  styleUrls: ['./shapePropertyDialog.component.css']
})
export class ShapePropertyDialogComponent {

  shapes: Shape[] = [];
  @Input() cancelMessage: string = 'Cancel';
  @Input() okMessage: string = 'Save';
  @Input() state: string = "";
  modelName = new FormControl();
  shapeName = new FormControl();

  @Output() stateChange: EventEmitter<string> = new EventEmitter<string>();;
  fom = FreedomOfMotion;
  ot = objectTypes;
  at = AreaType;

  constructor(private canvasService: CanvasService,
    public dialogRef: MatDialogRef<ShapePropertyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IShapeData
    , public dialog: MatDialog) {
    this.shapeName.setValue(data.name);
  }

  get States() {
    return DisplayValues.StateNames;
  }

  AreaTypeChanged(value: AreaType) {
      this.data.freedomOfSizing = FreedomOfMotion.full;
  }

  OnNameChange(value: string) {
    this.data.name = value;
  }

  OnStateChange(select: any) {
    this.data.state = select.value;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
