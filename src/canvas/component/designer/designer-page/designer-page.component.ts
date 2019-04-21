import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseDesignerModel, EditModel, tooltypes } from 'src/canvas/models/designer/base.model';
import { StateIndex, DisplayValues } from 'src/canvas/models/DisplayValues';
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
  @Output() deleteItem = new EventEmitter<null>();
  @Output() stateChange = new EventEmitter<null>();
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
      default: this.designer.SetTool(tooltypes.typecount); break;
    }
  }

  CopySelectedItem() {
   // this.designer
  }

  DeleteSelectedItem() {
    this.editor.RemoveContentById(this.selectedId);
    this.deleteItem.emit();
  }

  ColorSelected(value: { type: string, color: string }) {
    if (this.selectedId.length <= 0) { }
    switch (value.type) {
      case 'bg': DisplayValues.SetColor(this.selectedId + '_' + value.type, value.color); break;
    }
    this.editor.UpdateContextState();
    this.stateChange.emit();
  }

  SelectTool(e: ShapeSelectResult) {
    this.designer.SetTool(e.type);
  }
}
