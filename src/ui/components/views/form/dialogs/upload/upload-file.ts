import { Component, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataHTTPService } from 'src/dataManagement/service/dataHTTP.service';

export interface DialogData {
  sourceId: string;
}

@Component({
  selector: 'upload-file',
  templateUrl: 'upload-file.html',
  styleUrls: ['upload-file.css']
})
export class UploadFileDialog {
  uploading: boolean = false;
  fileAttachment: string = '';
//  @Input() deleteQuestion: string = 'Are you certain you wish to remove this item?';
  @Input() cancelMessage: string = 'Ignore';
  @Input() okMessage: string = 'Upload';

  constructor(
    public dialogRef: MatDialogRef<UploadFileDialog>
    , private httpService: DataHTTPService
    ,@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  //  this.deleteQuestion = data.question || 'Are you certain you wish to remove this item?';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileChange(files: FileList) {
    if (files.length > 0) {
      this.httpService.StreamData(files[0]).subscribe(
        data => { this.UploadSuccess(data) },
        err => { this.Fail(err) });
    }
  }

  UploadSuccess(data: any) {
    data.formName = this.data.sourceId;
    this.httpService.postContent(data, 'https://localhost:44336/api/data/LoadDataFile').subscribe(
      data => { this.DataProcessSuccess(data) },
      err => { this.Fail(err) });
  }

  DataProcessSuccess(data: any) {
  }

  Fail(data: any) {
//    this.FinishedLoading();
  }

}
