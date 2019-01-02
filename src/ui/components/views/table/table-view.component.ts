import { Component,Input } from '@angular/core';
import { Field } from '../../../../dataManagement/model/field';
import { IRecordService } from '../../../../dataManagement/model/records'
import { IElementDefinition } from '../../../../dataManagement/model/definitions/ElementDefinition';

@Component({
  selector: 'table-view',
  templateUrl: 'table-view.component.html',
  styleUrls: ['table-view.component.css']
})
export class TableViewComponent {

  @Input() elements: IElementDefinition<string>[] = [];
  @Input() fields: Field<any>[] = [];


  CellData(elm: IElementDefinition<string>, row: number): string {

    const fld = this.fields.find(f => f.FieldId == elm.FieldID());

    return fld.Data[row].toString();


  }

}
