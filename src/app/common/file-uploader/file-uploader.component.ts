import { Component, OnInit, Input } from '@angular/core';
//import { LayoutService } from '../../services/layout/layout-service.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { UploadFileDialog } from 'src/ui/components/views/form/dialogs/upload/upload-file';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {
  @Input() sourceId: string = '';

 // layoutIndex: number = -1;
  // @Input() layoutName: string = 'base';
  constructor(private snacker: MatSnackBar
    , public dialog: MatDialog) {
 //   this.layoutName = 'base';
  
  }

  ngOnInit() {
  //  this.layoutIndex = this.layout.getPatternIndex(this.layoutName);
  }

  presetDialog(): void {
    const dialogRef = this.dialog.open(UploadFileDialog, {
      width: '400px',
      data: { sourceId: this.sourceId }
    });
    dialogRef.afterClosed().subscribe(result => {
     
      //   this.httpService.


    });
  }
}
