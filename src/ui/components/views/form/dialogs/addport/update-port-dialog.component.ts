import { Component, Inject,Input,OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LineService } from 'src/canvas/models/lines/service/line.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPortPath, Line } from 'src/canvas/models/lines/line';
import { map, startWith } from 'rxjs/operators';

export interface PortData {
  result: string;
  offsetX: string;
  offsetY: string;
  line: string;
  path: string;
  name: string;
}

@Component({
  selector: 'port-update-dialog',
  templateUrl: 'update-port-dialog.component.html',
  styleUrls: ['update-port-dialog.component.css']
})
export class UpdatePortDialog implements OnInit {
  selectedLine: string = "";
  paths: Observable<IPortPath[]>;
  @Input() cancelMessage: string = 'No';
  @Input() okMessage: string = 'Ok';
  pathName = new FormControl();

  constructor(
    public lineService : LineService,
    public dialogRef: MatDialogRef<UpdatePortDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PortData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  LineSelected(line: Line) {
   // this.selectedLine = line;
  }

  ngOnInit() {
    this.paths = this.pathName.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): IPortPath[] {
    const v = value.toLowerCase();
    if (v.length <= 0) { return []; }
    this.data.path = value;
    this.data.line = this.selectedLine;
    let line = this.lineService._lines.find(l => l.Id == this.data.line);
    if (!line) { return []; }
    return line.Paths
      .filter(option => option.Id.toLowerCase().indexOf(v) >= 0);
  }
}
