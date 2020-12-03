import {
  Component, Input, Output, OnInit, EventEmitter, Inject
} from '@angular/core';
import { DisplayValues } from 'src/canvas/models/DisplayValues';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Shape } from 'src/canvas/models/shapes/shape';
import { CanvasService, objectTypes } from 'src/canvas/service/canvas.service';
import { FormControl } from '@angular/forms';
import { ePortType, Port } from 'src/canvas/models/shapes/port';
import { PortPath } from 'src/canvas/models/lines/line';
import { Observable } from 'rxjs';
import { FreedomOfMotion, AreaType, IShape } from 'src/canvas/models/shapes/IShape';
import { startWith, map } from 'rxjs/operators';
import { ImageModel } from 'src/canvas/models/shapes/content/image/image.model';
import { ContextLayer } from 'src/canvas/models/IContextItem';

export interface ICellData {
  name: string;
}

@Component({
  selector: 'unitcell-property-dialog',
  templateUrl: './unitCellPropertyDialog.component.html',
  styleUrls: ['./unitCellPropertyDialog.component.css']
})
export class UnitCellDialogComponent implements OnInit {

  shapes: Shape[] = [];
  @Input() cancelMessage: string = 'Cancel';
  @Input() okMessage: string = 'Save';
  @Input() state: string = "";
  unitcells: Observable<ContextLayer[]>;

  cellName = new FormControl();
  urlToImage = "";
  textContent = "";
  imageContentURL = "";
  imageFromDataSource: boolean = false;
  selectedImage: string = "";
  textState = "";
  @Output() stateChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(public canvasService: CanvasService,
    public dialogRef: MatDialogRef<UnitCellDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICellData
    , public dialog: MatDialog) { }

  get SelectedImage() {
    return '../Images/' + this.selectedImage;
  }
  get States() {
    return DisplayValues.StateNames;
  }

  AreaTypeChanged(value: AreaType) {
   // this.data.freedomOfSizing = FreedomOfMotion.full;
  }

  OnNameChange(value: string) {
    this.data.name = value;
  }

  OnTextStateChange(select: any) {
    this.textState = select.value;
  }

  OnStateChange(select: any) {
   // this.data.state = select.value;
  }

  get Cells() {
    if (!this.canvasService.BaseSystem) {
      return [];
    }
    return this.canvasService.BaseSystem.Layers || [];
  }

  onRemoveClick(): void {
    this.dialogRef.close();
  }

  onUpdateClick(): void {
    this.dialogRef.close();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.unitcells = this.cellName.valueChanges
      .pipe(
        startWith(''),
      map(value => this._filterCells(value))
      );
   
  }

  private _filterCells(value: string): ContextLayer[] {

    const v = value.toLowerCase();
    this.data.name = value;
    let list = this.canvasService.BaseSystem.Layers
      .filter(option => option.UnitCell.Name.toLowerCase().indexOf(v) >= 0);
    if (list.length == 1 && list[0].Id == value) {}
    if (list.length <= 0) {

      return [];
    }
    return list;
  }
}
