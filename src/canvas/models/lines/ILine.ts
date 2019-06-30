import { Point } from "../shapes/primitives/point";
import { Port } from "../shapes/port";
import { PortPath } from "./line";

export interface ILine {
  DrawAllPaths(context: any);
  DrawPath(context: any, pathId: string);
  DrawPortPath(context: any, path: PortPath);
}

