import { Component, Input } from '@angular/core';
import { FilterService } from 'src/NAS_App/Services/filter/filter.service';
import { UserService } from 'src/app/user/service/app-user.service';

export class contentItem {  
  constructor(public content:string) {

  }

  get Content() { return this.content }
}
export class contentRow {

  constructor(
    public row: number = 0,
    public data: contentItem[] = []) {
  }
}

export class contentModel {

  constructor(
    public columnColor: string[] = [],
    public columnCount: number = 4,
    public data: contentRow[] = []) {

    let hdr: contentItem[] = [];
    hdr.push(new contentItem("*"));
    hdr.push(new contentItem("Column One"));
    hdr.push(new contentItem("Column Two"));
    hdr.push(new contentItem("Column Three"));
    data.push(new contentRow(0, hdr));

    let row: contentItem[] = [];
    row.push(new contentItem("row 1"));
    row.push(new contentItem("row 1 Item One"));
    row.push(new contentItem("row 1 Item Two"));
    row.push(new contentItem("row 1 Item Tree"));
    data.push(new contentRow(1, row));

    row = [];
    row.push(new contentItem("row 2"));
    row.push(new contentItem("row 2 Item One"));
    row.push(new contentItem("row 2 Item Two"));
    row.push(new contentItem("row 2 Item Tree"));
    data.push(new contentRow(2, row));

    row = [];
    row.push(new contentItem("row 3"));
    row.push(new contentItem("row 3 Item One"));
    row.push(new contentItem("row 3 Item Two"));
    row.push(new contentItem("row 3 Item Tree"));
    data.push(new contentRow(3, row));
  }

  ColumnColor(col: number) {
    return this.columnColor[col];
  }

  Data(row: number) {
    return this.data[row].data;
  }
}

@Component({

  selector: 'content-grid',
  templateUrl: './contentGrid.component.html',
  styleUrls: ['./contentGrid.component.css']
})
export class ContentGridComponent {

  tempdata: contentModel;

  constructor() {

    this.tempdata = new contentModel(['#FFFFFF','#C0C0C0', '#FFD700', '#e5e4e2']);
    //this.tempdata.push(new content('#FFD700', "Second"));
    //this.tempdata.push(new content('#e5e4e2', "Third"));

  }

}

