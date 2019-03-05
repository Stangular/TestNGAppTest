import { Component, OnInit, Inject, Input, Output,EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
//https://blog.angular-university.io/angular-material-dialog/
export interface DialogData {
  result: string;
  value: any;
}

@Component({
  selector: 'app-popup-content',
  templateUrl: './popup-content.component.html',
  styleUrls: ['./popup-content.component.css']
})
export class PopupContentComponent implements OnInit {
  @Input() cancelMessage: string = 'No';
  @Input() okMessage: string = 'Ok';
  @Input() content: any = {};
  @Output() action: EventEmitter<number> = new EventEmitter<number>();
  constructor(public dialogRef: MatDialogRef<PopupContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  onClose(result: boolean) {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
