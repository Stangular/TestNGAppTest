import { Line } from "../lines/line";
import { Point } from "../shapes/primitives/point";
import { StateIndex, UIStates, DisplayValues } from "../DisplayValues";
import { Rectangle } from "../shapes/rectangle";
import { Shape } from "../shapes/shape";
import { Text } from "../shapes/content/text/text";
import { ContextLayer, IContextItem } from "../IContextItem";
import { ShapeSelectResult } from "../shapes/shapeSelected";

class Mover {

}

class Sizer {

}

export class EditModel extends ContextLayer  {
  contactPoint: Point = new Point();
  tooltype: tooltypes = tooltypes.typecount;
  // images
  private designerpad = new StateIndex('designerpad');

  constructor() {
    super('edit', 'default');

    let bgNdx = DisplayValues.GetColorIndex('default.edit.background');
    this.designerpad.setState(UIStates.background, bgNdx);
    this.designerpad.setState(UIStates.foreground, 1);
    this.designerpad.setState(UIStates.color, 4);
    this.designerpad.setState(UIStates.weight, 0);
    this.AddContent(new Rectangle('test111', 100, 100, 200, 200, this.designerpad);
  }

  Draw(context: any) {
    // this.toolbar.Draw(context);
    this.Content.forEach(function (item, i) { item.Draw(context); });
  }

  Select(shapeSelectResult: ShapeSelectResult): boolean {

    shapeSelectResult.id = '';
    shapeSelectResult.type = '';

    // let tooltype = this.toolbar.SelectTool(shapeSelectResult);
    if (super.Select(shapeSelectResult)){
      let shape = this.Content.find(c => (c as Shape).IsSelected);
      if (shape) {
        shapeSelectResult.id = shape.Id;
        shapeSelectResult.type = 'shape';
      }
      //   this.content.findIndex()
      return true;
    }
 //   return this.AddNewItem(this.tooltype, shapeSelectResult.point);
    return false;
  }

  SetTool(tool: tooltypes) {
    this.tooltype = tool;
  }

  Edit(itemId: string) {

  }

  AddEditItem(shape: Shape, point: Point) {

   // this.Content.length = 0;
    if (shape) {
      this.contactPoint.SetToPosition(point.X, point.Y);
      this.AddContent(shape);
      return true;
    }
    return false;
  }
}

enum tooltypes {
  rectangle = 0,
  ellipse = 1,
  lineStraight = 2,
  lineGradient = 3,
  lineBezier = 4,
  typecount = 5
}

class ToolBarTool extends Rectangle {

  private selected: boolean = false;

  constructor(private type: tooltypes,
    id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    state: StateIndex) {
    super(id,
      top,
      left,
      width,
      height,
      state);
  }

  get IsSelected() {
    return this.selected;
  }

  get ToolType(): tooltypes {
    return this.type;
  }

  SelectShape(shapeSelectResult: ShapeSelectResult): boolean {
    this.selected = super.SelectShape(shapeSelectResult);

    return this.selected;
  }
}

class RectangleTool extends ToolBarTool {



}

class EllispeTool extends ToolBarTool {

}

class LineTool extends ToolBarTool {

}

class ImageTool extends ToolBarTool {

}

export class Toolbar extends ContextLayer {

  private designState = new StateIndex('designertoolbar');
  private selectedTool = tooltypes.typecount;

  constructor() {
    super("toolbar", "default");
    let bgNdx = DisplayValues.GetColorIndex('toolbar.tool.background');
    this.designState.setState(UIStates.background, bgNdx);
    this.designState.setState(UIStates.foreground, 1);
    this.designState.setState(UIStates.color, 4);
    this.designState.setState(UIStates.weight, 0);
    this.Build();
  }

  //Draw(context: any) {
  //  this.rightBorder.Draw(context);
  //  this.tools.forEach(function (t, i) {
  //    t.Draw(context);
  //  });
  //}

  Build() {
    this.BuildTools();
  }

  Select(shapeSelectResult: ShapeSelectResult): boolean {

    this.SelectTool(shapeSelectResult);
    shapeSelectResult.type = this.selectedTool;
    return this.selectedTool < tooltypes.typecount;

    // this.AddNewItem(tooltype, shapeSelectResult.point);

   
  }
  SelectTool(shapeSelectResult: ShapeSelectResult) {

     let tooltypeSelected: tooltypes = tooltypes.typecount;
    if (super.Select(shapeSelectResult)) {
      let tool = this.Content.find(c => (c as ToolBarTool).IsSelected);
      if (tool && (<ToolBarTool>tool).ToolType < tooltypes.typecount) {
        this.selectedTool = (<ToolBarTool>tool).ToolType;
      }
      //this.Content.forEach(function (c, i) {
      //  let tool: ToolBarTool = c as ToolBarTool;
      //  if (tool.IsSelected) {
      //    tooltypeSelected = tool.ToolType;
      //  }
      //});
    }
    //let tool = this.Content.find(c => (c as ToolBarTool).IsSelected);
    //if (tool && (<ToolBarTool>tool).ToolType < tooltypes.typecount) {
    //  this.selectedTool = (<ToolBarTool>tool).ToolType;
    //}
    return this.selectedTool;
  }

  get SelectedType(): tooltypes {
    return this.selectedTool;
  }

  BuildTools(
    size: number = 45,
    w: number = 40,
    h: number = 40,
    t: number = 10,
    l: number = 10) {

    for (let i = 0; i < tooltypes.typecount; i++) {
      //   this.tools
      this.AddContent(
        new ToolBarTool(i,
          'tool_' + i.toString(),
          t, l, w, h, this.designState));
      t += w + 10;
    }
  }
}

export class BaseDesignerModel extends ContextLayer {

  shapes: Shape[] = [];
  lines: Line[] = [];
  text: Text[] = [];
  tooltype: tooltypes = tooltypes.typecount;
  // images
  private designerpad = new StateIndex('designerpad');

  constructor() {
    super('designer', 'default');
 
    let bgNdx = DisplayValues.GetColorIndex('default.rect.background');
    this.designerpad.setState(UIStates.background, bgNdx);
    this.designerpad.setState(UIStates.foreground, 1);
    this.designerpad.setState(UIStates.color, 4);
    this.designerpad.setState(UIStates.weight, 0);
  }

  Draw(context: any) {
   // this.toolbar.Draw(context);
    this.Content.forEach(function (item, i) { item.Draw(context); });
  }

  Select(shapeSelectResult: ShapeSelectResult): boolean {

    shapeSelectResult.id = '';
    shapeSelectResult.type = '';

    // let tooltype = this.toolbar.SelectTool(shapeSelectResult);
    if (super.Select(shapeSelectResult)){
      let shape = this.Content.find(c => (c as Shape).IsSelected);
      if (shape) {
        shapeSelectResult.id = shape.Id;
        shapeSelectResult.type = 'shape';
      }
   //   this.content.findIndex()
      return true;
    }
    return this.AddNewItem(this.tooltype, shapeSelectResult.point);
   
  }

  SetTool(tool: tooltypes) {
    this.tooltype = tool;
  }

  Edit(itemId:string) {

  }


  RemoveShapeForEdit(id: String) {
    let shape: Shape = null;
    let ndx = this.Content.findIndex(c => c.Id == id);
    if (ndx >= 0) {
      shape = this.Content[ndx] as Shape;
      this.Content.splice(ndx, 1);
    }
    return shape;
  }


  AddNewItem(tooltype: tooltypes, point: Point) {

    let shape: IContextItem = null;

    switch (tooltype) {
      case tooltypes.rectangle:
        shape = new Rectangle('sssx', point.Y, point.X, 30, 30, this.designerpad);
        break;
      case tooltypes.ellipse: break;
      case tooltypes.lineStraight: break;
      case tooltypes.lineGradient: break;
      case tooltypes.lineBezier: break;
    }
    if (shape) {
      this.AddContent(shape);
      return true;
    }
    return false;
  }
}
