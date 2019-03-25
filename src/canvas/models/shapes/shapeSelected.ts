import { Point } from "./primitives/point";

export class ShapeSelectResult {
  id: string;
  type: any;
  name: string;
  point: Point = new Point();
}
