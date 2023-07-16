import { Component, Inject,Input,OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPortPath, Line, PortPath } from 'src/canvas/models/lines/line';
import { map, startWith } from 'rxjs/operators';
import { Port } from 'src/canvas/models/shapes/port';
import { Path } from 'src/canvas/models/lines/path';
import { CanvasService } from 'src/canvas/service/canvas.service';
import { IShape } from 'src/canvas/models/shapes/IShape';

export interface PortData {
  result: string;
  offsetX: string;
  offsetY: string;
  path: string;
  name: string;
  paths: PortPath[];
}

@Component({
  selector: 'port-update-dialog',
  templateUrl: 'update-port-dialog.component.html',
  styleUrls: ['update-port-dialog.component.css']
})
export class UpdatePortDialog implements OnInit {
 // portType = this.ept.source;
  paths: Observable<PortPath[]>;
  ports: Observable<IShape[]>;
  pathName = new FormControl();
  portName = new FormControl();
  @Input() cancelMessage: string = 'Cancel';
  @Input() okMessage: string = 'Save';
  constructor(
    public canvasService: CanvasService,
    public dialogRef: MatDialogRef<UpdatePortDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PortData
    , public dialog: MatDialog) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  LineSelected(line: Line) {
   // this.selectedLine = line;
  }

  RemovePort() {}

  ngOnInit() {
    this.ports = this.portName.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterPort(value))
    );
    //if (this.canvasService.ActiveShape.Ports.length > 0) {
    //  let port = this.canvasService.ActiveShape.Ports[0];
    //  this.portName.setValue(port.Id);
    //}
  }

  private _filterPort(value: string): IShape[] {

    const v = value.toLowerCase();
     
    this.data.name = value;
    this.data.paths = [];
    let list = null; //this.canvasService.ActiveShape.Ports
    //  .filter(option => option.Id.toLowerCase().indexOf(v) >= 0);
    //if (list.length == 1) {
    //  let port = list[0] as Port;
    //  this.data.offsetX = port.OffsetX.toString();
    //  this.data.offsetY = port.OffsetY.toString();
    ////  this.data.path = port.PathId;
    //}
    //if (list.length <= 0) {
    //  this.data.offsetX = "0";
    //  this.data.offsetY = "0";
    //  this.data.path = '';
    //}
    //if (list.length > 0) {
    //  this.pathName.setValue(list[0].Id);
    //}
    return list;
  }

  PortSelected() {

  }

  get ValidLineName() {
    return this.data.name.length > 0;
  }

  get PortSaved() {
    return false;
  }
  
}
