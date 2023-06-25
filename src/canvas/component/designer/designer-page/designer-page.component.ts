import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseDesignerModel, EditModel, tooltypes } from 'src/canvas/models/designer/base.model';
import { StateIndex, DisplayValues } from 'src/canvas/models/DisplayValues';
import { ShapeSelectResult } from 'src/canvas/models/shapes/shapeSelected';
import { Shape } from 'src/canvas/models/shapes/shape';
import { CanvasService, objectTypes } from 'src/canvas/service/canvas.service';
import { MessageService } from 'src/app/messaging/message.service';
import { LineService } from 'src/canvas/models/lines/service/line.service';
import { PortService } from 'src/canvas/models/shapes/service/port.service';


@Component({
  selector: 'app-designer-page',
  templateUrl: './designer-page.component.html',
  styleUrls: ['./designer-page.component.css']
})
export class DesignerPageComponent implements OnInit {
  bgColor: string = 'yellow';
  transparentBG: string = 'transparent';
  editTop: number = 0;
  editLeft: number = 0;
  editWidth: number = 0;
  editHeight: number = 0;
  id: string = 'designer';
  selectedId: string = '';
  //private designer: BaseDesignerModel;
  // private toolbar: Toolbar;
  //private editor: EditModel;
  private designState = new StateIndex('barsss');
  @Output() deleteItem = new EventEmitter<null>();
  @Output() stateChange = new EventEmitter<null>();
  constructor(
    private portService: PortService,
    private lineService: LineService,
    public canvasService: CanvasService
    , private messageService: MessageService
  ) {

    //this.designState.setState(UIStates.background, );
    //this.designState.setState(UIStates.foreground, 1);
    //this.designState.setState(UIStates.color, 4);
    //this.designState.setState(UIStates.weight, 0);

    //this.designer = new BaseDesignerModel();
    // this.toolbar = new Toolbar();
    // this.editor = new EditModel();
  }

  ngOnInit() {
    let sss = 0;
  }

  onSelect(item: any) {
    let sss = 0;
  }

  ItemMoved(e: ShapeSelectResult) {

    //let shp : Shape = this.canvasService.Editor.CurrentShape;
    //if (shp) {
    //  this.editTop = shp.Top;
    //  this.editLeft = shp.Left;
    //  this.editWidth = shp.Width;
    //  this.editHeight = shp.Height;
    //  setTimeout(() =>
    //    this.messageService.sendMessage(11), 0);
    //}


  }

  ItemSelected(e: ShapeSelectResult) {
    if (this.selectedId.length > 0) {
     // let s = this.canvasService.Editor.RemoveContentById(this.selectedId);
  //    this.canvasService.Designer.AddContent(s);
      this.selectedId = '';
    }
    else {
   //   let s = this.canvasService.Designer.RemoveContentById(e.id);
      this.selectedId = e.id;
   //   this.canvasService.Editor.AddEditItem(s as Shape, e.point);
    }
  }

  TypeSelected(type: objectTypes) {
    //switch (type) {
    //  case objectTypes.rectangle: this.canvasService.Designer.SetTool(tooltypes.rectangle); break;
    //  case objectTypes.ellipse: this.canvasService.Designer.SetTool(tooltypes.ellipse); break;
    //  default: this.canvasService.Designer.SetTool(tooltypes.typecount); break;
    //}

  }

  CopySelectedItem() {
    // this.designer
  }

  DeleteSelectedItem() {
  //  this.canvasService.Editor.RemoveContentById(this.selectedId);
    this.deleteItem.emit();
  }

  ColorSelected(value: { type: string, color: string }) {
    if (this.selectedId.length <= 0) { }
    switch (value.type) {
      case 'bg': DisplayValues.SetColor(this.selectedId + '_' + value.type, value.color); break;
    }
 //   this.canvasService.Editor.UpdateContextState();
    this.stateChange.emit();
  }

  ShapeSelected(result: ShapeSelectResult) {
    let sss = 0;
  }

  SelectTool(e: ShapeSelectResult) {
 //   this.canvasService.Designer.SetTool(e.type);
  }

  UpdateLine(lineData: any) {}

  UpdatePort(portData: any) {
   // this.canvasService.AddPort(portData);
 //   this.canvasService.DrawSystem(this.canvasService.SelectedUnitCellId);
  }

  ShapeChanged(sid:string) {
  //  this.canvasService.DrawSystem(this.canvasService.SelectedUnitCellId);
  }
}
