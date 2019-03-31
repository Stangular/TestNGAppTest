import { Component, OnInit } from '@angular/core';
import { BaseDesignerModel, Toolbar, EditModel } from '../base.model';
import { StateIndex, UIStates, DisplayValues } from '../../DisplayValues';
import { ShapeSelectResult } from '../../shapes/shapeSelected';
import { Shape } from '../../shapes/shape';

@Component({
  selector: 'app-designer-page',
  templateUrl: './designer-page.component.html',
  styleUrls: ['./designer-page.component.css']
})
export class DesignerPageComponent implements OnInit {

  id: string = 'designer';
  selectedId: string = '';
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
    if (this.selectedId.length > 0) {
      let s = this.editor.RemoveContentById(this.selectedId);
      this.designer.AddContent(s);
      this.selectedId = '';
    }
    else {
      let s = this.designer.RemoveContentById(e.id);
      this.selectedId = e.id;
      this.editor.AddEditItem(s as Shape, e.point);
    }
  }

  SelectTool(e: ShapeSelectResult) {
    this.designer.SetTool(e.type);
  }
}
