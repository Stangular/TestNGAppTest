import { Component, OnInit } from '@angular/core';
import { BaseDesignerModel, Toolbar, EditModel } from '../base.model';
import { StateIndex, UIStates, DisplayValues } from '../../DisplayValues';
import { ShapeSelectResult } from '../../shapes/shapeSelected';

@Component({
  selector: 'app-designer-page',
  templateUrl: './designer-page.component.html',
  styleUrls: ['./designer-page.component.css']
})
export class DesignerPageComponent implements OnInit {

  id: string = 'designer';
  private designer: BaseDesignerModel;
  private toolbar: Toolbar;
  private editor : EditModel;
  private designState = new StateIndex('barsss');

  constructor() {

    //this.designState.setState(UIStates.background, );
    //this.designState.setState(UIStates.foreground, 1);
    //this.designState.setState(UIStates.color, 4);
    //this.designState.setState(UIStates.weight, 0);

    this.designer = new BaseDesignerModel();
    this.toolbar = new Toolbar();
    this.editor = new EditModel();
  }

  ngOnInit() {}

  onSelect(item: any) { }

  ItemSelected(e: ShapeSelectResult) {
    let s = this.designer.RemoveShapeForEdit(e.id);
    this.editor.AddEditItem(s, e.point);
   // this.designer.SetTool(e.type);
  }

  SelectTool(e: ShapeSelectResult) {
    this.designer.SetTool(e.type);
  }
}
