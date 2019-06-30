import { Line } from "../lines/line";
import { Point } from "../shapes/primitives/point";
import { StateIndex, UIStates, DisplayValues } from "../DisplayValues";
import { Rectangle } from "../shapes/rectangle";
import { Shape } from "../shapes/shape";
import { Text, TextCenter } from "../shapes/content/text/text";
import { ContextLayer, IContextItem } from "../IContextItem";
import { ShapeSelectResult } from "../shapes/shapeSelected";
import { ContentImage } from "../shapes/content/image/image";
import { Ellipse } from "../shapes/ellipse";
import { Port } from "../shapes/port";
import { Size } from "src/d3/services/d3.common.model";

class Mover {

}

class Sizer extends Rectangle {
  constructor(id: string,
    private rangeOfMotion: number,
    private side: number, // 0=toplft,1=top,2=toprgt, 3=rgt, 4=btmrgt, 5=btm, 6=btmlft,7=lft 
    top: number,
    left: number,
    width: number,
    height: number,
    state: StateIndex) {
    super(id, top, left, width, height, state);
  }

  MoveByXXX(x: number, y: number, side: number) {
    switch (this.side) {
      case 0:
        if (side == 1 || side == 7 || side == 2 || side == 6) {
          this.MoveBySSS(x, y);
        }
        break;
      case 1:
        if (side == 0 || side == 2) {
          this.MoveBySSS(x, y);
        }
        break;
      case 2:
        if (side == 1 || side == 3 || side == 4) {
          this.MoveBySSS(x, y);
        }
        break;
      case 3:
        if (side == 2 || side == 4) {
          this.MoveBySSS(x, y);
        }
        break;
      case 4:
        if (side == 2 || side == 3 || side == 5 || side == 6) {
          this.MoveBySSS(x, y);
        }
        break;
      case 5:
        if (side == 4 || side == 6) {
          this.MoveBySSS(x, y);
        }
        break;
      case 6:
        if (side == 0 || side == 7 || side == 5 || side == 4) {
          this.MoveBySSS(x, y);
        }
        break;
      case 7:
        if (side == 0 || side == 6) {
          this.MoveBySSS(x, y);
        }
        break;
    }
  }

  MoveBySSS(x: number, y: number) {
    switch (this.rangeOfMotion) {
      case 0: super.MoveBy(x, y); break;
      case 1: super.MoveBy(0, y); break;
      case 2: super.MoveBy(x, 0); break;
    }
  }

  get Side(): number { return this.side; }
}

export class EditModel extends ContextLayer {
  private contactPoint: Point = new Point();
  private tooltype: tooltypes = tooltypes.typecount;
  // images
  selectedId: string = "";
  activeShapeId: string = "";
  private _sizer: Sizer[] = [];
  private designerpad = new StateIndex('designerpad');

  constructor() {
    super('edit', 'default');
    let bgNdx = DisplayValues.GetColorIndex('default.edit.background');
    this.designerpad.setState(UIStates.background, bgNdx);
    this.designerpad.setState(UIStates.foreground, 1);
    this.designerpad.setState(UIStates.color, 4);
    this.designerpad.setState(UIStates.weight, 0);
    // this.AddContent(new Rectangle('test111', 100, 100, 200, 200, this.designerpad));
    this._sizer.push(new Sizer('sizerTopLeft', 0, 0, 0, 0, 9, 9, this.designerpad));
    this._sizer.push(new Sizer('sizerTop', 1, 1, 0, 0, 9, 9, this.designerpad));
    this._sizer.push(new Sizer('sizerTopRight', 0, 2, 0, 0, 9, 9, this.designerpad));
    this._sizer.push(new Sizer('sizerRight', 2, 3, 0, 0, 9, 9, this.designerpad));
    this._sizer.push(new Sizer('sizerBottomRight', 0, 4, 0, 0, 9, 9, this.designerpad));
    this._sizer.push(new Sizer('sizerBottom', 1, 5, 0, 0, 9, 9, this.designerpad));
    this._sizer.push(new Sizer('sizerBottomLeft', 0, 6, 0, 0, 9, 9, this.designerpad));
    this._sizer.push(new Sizer('sizerLeft', 2, 7, 0, 0, 9, 9, this.designerpad));
  }

  Draw(context: any) {
    // this.toolbar.Draw(context);
    this.Content.forEach(function (item, i) { item.Draw(context); });
  }

  get ActiveShapeId() {
    return this.activeShapeId;
  }

  get CurrentShape(): Shape {
    let shape = this.Content.find(s => s.Id == this.activeShapeId);

    return shape as Shape;
  }

  MoveItem(shapeSelectResult: ShapeSelectResult, ports: Port[]) {
    let self = this;
    let shpPorts = ports.filter(p => p.ParentShapeId == shapeSelectResult.id);
    let dx = shapeSelectResult.point.X - this.contactPoint.X;
    let dy = shapeSelectResult.point.Y - this.contactPoint.Y;
    let sid = this._sizer.findIndex(s => s.Id == this.selectedId);
    if (sid >= 0) {// A sizer node is selected...
      this._sizer[sid].MoveBySSS(dx, dy);
      let shape = this.Content.find(c => c.Id == this.activeShapeId) as Shape;
      if (shape) {
        this._sizer.forEach(function (s, i) {
          s.MoveByXXX(dx, dy, self._sizer[sid].Side);
        });
        shape.SizeBy(
          this._sizer[1].Center.Y,
          this._sizer[3].Center.X,
          this._sizer[5].Center.Y,
          this._sizer[7].Center.X);
        this.ResetSizer(shape);
        shpPorts.forEach(function (p, i) {
          p.SizeBy(shape.Top, shape.Right, shape.Bottom, shape.Left);
        });
      }
    }
    else {
      this.Content.forEach(function (s, i) {
        let shp: Shape = s as Shape;
        shp.MoveBy(dx, dy);
        shpPorts.forEach(function (p, i) {
          p.MoveBy(dx, dy);
        });
      });
    }
    this.contactPoint.SetToPosition(
      shapeSelectResult.point.X,
      shapeSelectResult.point.Y
    );
  }

  Select(shapeSelectResult: ShapeSelectResult): boolean {

    shapeSelectResult.id = '';
    shapeSelectResult.type = '';

    if (super.Select(shapeSelectResult)) {
      let shape = this._sizer.find(s => s.SelectShape(shapeSelectResult)) as Shape;
      if (!shape) {
        shape = this.Content.find(c => (c as Shape).IsSelected) as Shape;
        if (shape) {
          this.activeShapeId = shape.Id;
          this.ResetSizer(shape);
        }
      }
      if (shape) {
        this.selectedId = shape.Id;
        shapeSelectResult.id = shape.Id;
        shapeSelectResult.type = 'shape';
        this.contactPoint.SetToPosition(
          shapeSelectResult.point.X,
          shapeSelectResult.point.Y);
      }
      return true;
    }
    return false;
  }

  SetTool(tool: tooltypes) {
    this.tooltype = tool;
  }

  Edit(itemId: string) { }

  ResetSizer(shape: Shape) {
    let xhalf = shape.Left + shape.Width / 2;
    let yhalf = shape.Top + shape.Height / 2;

    this._sizer[0].CenterOn(shape.Left, shape.Top);
    this._sizer[1].CenterOn(xhalf, shape.Top);
    this._sizer[2].CenterOn(shape.Right, shape.Top);
    this._sizer[3].CenterOn(shape.Right, yhalf);
    this._sizer[4].CenterOn(shape.Right, shape.Bottom);
    this._sizer[5].CenterOn(xhalf, shape.Bottom);
    this._sizer[6].CenterOn(shape.Left, shape.Bottom);
    this._sizer[7].CenterOn(shape.Left, yhalf);

  }

  AddEditItem(shape: Shape, point: Point) {

    this.Content.length = 0;
    if (shape) {
      this.contactPoint.SetToPosition(point.X, point.Y);
      this.AddContent(shape);

      let self = this;

      this.ResetSizer(shape);
      this._sizer.forEach(function (r, i) {
        self.AddContent(r);
      });
      this.selectedId = shape.Id;
      this.activeShapeId = shape.Id;
      //    this.MoveItem(point);
      return true;
    }
    return false;
  }
}

export enum tooltypes {
  rectangle = 0,
  ellipse = 1,
  lineStraight = 2,
  lineGradient = 3,
  lineBezier = 4,
  typecount = 5
}



export class BaseDesignerModel extends ContextLayer {

  point: Point;
  shapes: Shape[] = [];
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
    this.Content.forEach(function (item, i) { item.Draw(context); });
  }

  Select(shapeSelectResult: ShapeSelectResult): boolean {

    shapeSelectResult.id = '';
    shapeSelectResult.type = '';
    this.point = shapeSelectResult.point;
    if (super.Select(shapeSelectResult)) {
      let shape = this.Content.find(c => (c as Shape).IsSelected);
      if (shape) {
        shapeSelectResult.id = shape.Id;
        shapeSelectResult.type = 'shape';
      }
      return true;
    }
    return false; // this.AddNewItem(this.tooltype, shapeSelectResult.point);

  }

  SetTool(tool: tooltypes) {
    this.tooltype = tool;
  }

  Edit(itemId: string) {

  }

  RemoveShape(id: String) {
    let ndx = this.Content.findIndex(c => c.Id == id);
    if (ndx < 0) { return false; }
    this.Content.splice(ndx, 1);
    return true;
  }

  CopyShape(id: string) {
    let ndx = this.Content.findIndex(c => c.Id == id);
    if (ndx < 0) { return false; }
    let shape: Shape = null;
    shape = this.Content[ndx] as Shape;
    super.AddContent(shape.CopyShape(id) as IContextItem);
    return true;
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

  AddContent(content: IContextItem) {
    if (!content) {
      this.AddNewItem(this.point);
    }
    else {
      super.AddContent(content);
    }
  }

  AddNewItem(point: Point) {

    let shape: IContextItem = null;
    let cnt = this.Content.length;
    switch (this.tooltype) {
      case tooltypes.rectangle:
        shape = new Rectangle('rect_' + cnt, point.Y, point.X, 30, 30, this.designerpad);
        break;
      case tooltypes.ellipse:
        shape = new Ellipse('ellipse_' + cnt, point.Y, point.X, 30, 30, this.designerpad);
        break;
      //case tooltypes.lineStraight: break;
      //case tooltypes.lineGradient: break;
      //case tooltypes.lineBezier: break;
    }
    if (shape) {
      super.AddContent(shape);
      return true;
    }
    return false;
  }
}
