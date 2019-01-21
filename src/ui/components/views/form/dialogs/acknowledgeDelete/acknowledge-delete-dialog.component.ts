import { Component, Inject,Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  result: string;
  why: string;
  question: string;
}

@Component({
  selector: 'dialog-acknowledge-delete',
  templateUrl: 'acknowledge-delete-dialog.component.html',
})
export class AcknowlegeDeleteDialog {
  @Input() deleteQuestion: string = 'Are you certain you wish to remove this item?';
  @Input() cancelMessage: string = 'No';
  @Input() okMessage: string = 'Ok';
  constructor(
    public dialogRef: MatDialogRef<AcknowlegeDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.deleteQuestion = data.question || 'Are you certain you wish to remove this item?';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
