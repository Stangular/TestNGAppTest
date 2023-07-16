import { Point } from "../shapes/primitives/point";
import { Port } from "../shapes/port";
import { PortPath, lineTypes } from "./line";
import { IContextItem } from "../IContextItem";
import { StateIndex } from "../DisplayValues";

export interface ILine extends IContextItem {
 // DrawPortPath(context: any, path: PortPath);
 // ResetPath(ports: Port[]);
  State: StateIndex;
  Type: lineTypes;
  StateName: string;
  Plot(ctx: CanvasRenderingContext2D, path: Point[]);
  Update(stateName: string);
  DrawLine(ctx: CanvasRenderingContext2D, path: Point[]): void;
}

