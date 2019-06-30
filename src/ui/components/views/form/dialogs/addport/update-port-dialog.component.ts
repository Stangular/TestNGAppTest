import { Component, Inject,Input,OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LineService } from 'src/canvas/models/lines/service/line.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPortPath, Line } from 'src/canvas/models/lines/line';
import { map, startWith } from 'rxjs/operators';
import { ePortType } from 'src/canvas/models/shapes/port';
import { PortService } from 'src/canvas/models/shapes/service/port.service';
import { PathService } from 'src/canvas/models/shapes/service/path.service';
import { Path } from 'src/canvas/models/lines/path';

export interface PortData {
  result: string;
  offsetX: string;
  offsetY: string;
  path: string;
  name: string;
  type: ePortType;
}

@Component({
  selector: 'port-update-dialog',
  templateUrl: 'update-port-dialog.component.html',
  styleUrls: ['update-port-dialog.component.css']
})
export class UpdatePortDialog implements OnInit {
  ept = ePortType;
  portType = this.ept.source;
  paths: Observable<Path[]>;
  pathName = new FormControl();
  @Input() cancelMessage: string = 'No';
  @Input() okMessage: string = 'Ok';
  constructor(
    public portService: PortService,
    public pathService: PathService,
    public lineService: LineService,
    public dialogRef: MatDialogRef<UpdatePortDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PortData) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  LineSelected(line: Line) {
   // this.selectedLine = line;
  }

  ngOnInit() {
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
  
}
