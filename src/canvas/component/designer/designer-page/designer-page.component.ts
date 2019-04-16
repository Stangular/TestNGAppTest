import { Component, OnInit } from '@angular/core';
import { BaseDesignerModel, EditModel, tooltypes } from 'src/canvas/models/designer/base.model';
import { StateIndex } from 'src/canvas/models/DisplayValues';
import { ShapeSelectResult } from 'src/canvas/models/shapes/shapeSelected';
import { Shape } from 'src/canvas/models/shapes/shape';
import { CanvasService, objectTypes } from 'src/canvas/service/canvas.service';


@Component({
  selector: 'app-designer-page',
  templateUrl: './designer-page.component.html',
  styleUrls: ['./designer-page.component.css']
})
export class DesignerPageComponent implements OnInit {

  id: string = 'designer';
  selectedId: string = '';
  private designer: BaseDesignerModel;
  // private toolbar: Toolbar;
  private editor: EditModel;
  private designState = new StateIndex('barsss');

  constructor(
    private canvasService: CanvasService
  ) {

    //this.designState.setState(UIStates.background, );
    //this.designState.setState(UIStates.foreground, 1);
    //this.designState.setState(UIStates.color, 4);
    //this.designState.setState(UIStates.weight, 0);

    this.designer = new BaseDesignerModel();
    // this.toolbar = new Toolbar();
    this.editor = new EditModel();
  }

  ngOnInit() { }

  onSelect(item: any) {
    let sss = 0;
  }

  ItemSelected(e: ShapeSelectResult) {
    if (this.selectedId.length > 0) {
      let s = this.editor.RemoveContentById(this.selectedId);
      this.designer.AddContent(s);
      this.selectedId = ''; ``
    }
    else {
      let s = this.designer.RemoveContentById(e.id);
      this.selectedId = e.id;
      this.editor.AddEditItem(s as Shape, e.point);
    }
  }

  TypeSelected(type: objectTypes) {
    switch (type) {
      case objectTypes.rectangle: this.designer.SetTool(tooltypes.rectangle); break;
      case objectTypes.ellipse: this.designer.SetTool(tooltypes.ellipse); break;
    }
  }

  CopySelectedItem() {
   // this.designer
  }

  DeleteSelectedItem() {

  }

  SelectTool(e: ShapeSelectResult) {
    this.designer.SetTool(e.type);
  }
}
