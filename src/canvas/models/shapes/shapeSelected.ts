import { Point } from "./primitives/point";

export class ShapeSelectResult {
  id: string;
  type: string;
  name: string;
  point: Point = new Point();
}
