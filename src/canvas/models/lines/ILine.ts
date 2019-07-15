import { Point } from "../shapes/primitives/point";
import { Port } from "../shapes/port";
import { PortPath, lineTypes } from "./line";
import { IContextItem } from "../IContextItem";
import { StateIndex } from "../DisplayValues";

export interface ILine extends IContextItem {
  Paths: PortPath[];
  DrawAllPaths(context: any);
  DrawPath(context: any, pathId: string);
  DrawPortPath(context: any, path: PortPath);
  DrawToContent(context: any, ports: Port[]);
  ResetPath(ports: Port[]);
  State: StateIndex;
  Type: lineTypes;
  StateName: string;
}

