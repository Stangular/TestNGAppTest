import { Point } from "./primitives/point";
import { Size } from "src/d3/services/d3.common.model";


export class ShapeSelectResult {
  id: string;
  type: any;
  name: string;
  point: Point = new Point();
  size: Size = new Size();
}
