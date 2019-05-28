import { Point } from "../shapes/primitives/point";
import { Port } from "../shapes/port";

export interface ILine {
  DrawLine(context: any
    , ports: Port[]);
}

