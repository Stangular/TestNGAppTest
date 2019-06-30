import { Point, TrackingPoint } from './primitives/point';

export interface IShape {

  Id: string;
  Top: number;
  Right: number;
  Bottom: number;
  Left: number;

  Width: number;
  Height: number;

  Center: Point;
  Class: string;
  AssignToClass(clss: string): void;
  DrawShape(context: any);
  MoveBy(x: number, y: number);
  SizeBy(top: number, right: number, bottom: number, left: number);
  CenterOn(x: number, y: number);
 // Track(point: TrackingPoint);
//  SetToPosition(point: TrackingPoint);
}



