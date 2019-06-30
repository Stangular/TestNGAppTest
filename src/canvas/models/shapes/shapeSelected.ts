import { Point } from "./primitives/point";
import { Size } from "src/d3/services/d3.common.model";
import { StateIndex, DisplayValues } from "../DisplayValues";


export enum eContentType {
  rectangle = 0,
  ellipse = 1,
  lineStraight = 2,
  lineGradient = 3,
  lineBezier = 4,
  typeCount = 5
}

export class ShapeSelectResult {

  id: string;
  type: any;
  name: string;
  point: Point = new Point();
  size: Size = new Size();
  layerId: string = '';
  itemCaptured: boolean = false;
  previousPoint: Point = new Point();
  shapeType: eContentType = eContentType.typeCount;
  state: StateIndex;

  get DX() { return this.point.X - this.previousPoint.X; }
  get DY() { return this.point.Y - this.previousPoint.Y; }

  UpdatePosition() {
    this.previousPoint.SetToPosition(this.point.X, this.point.Y);
  }

  PositionFromEvent(event: any, clientArea: any) {

    var offsetX = event.clientX - clientArea.left;
    var offsetY = event.clientY - clientArea.top;

    this.point.SetToPosition(offsetX, offsetY);
    if (!this.itemCaptured) {
      this.previousPoint.SetToPosition(offsetX, offsetY);
    }
  }

  get DesignState() {
    if (this.state) { return this.state; }
    this.state = DisplayValues.GetShapeIndex('default', 'default.rect.background', 'exlyrrect1border');
    return this.state;
  }
}
