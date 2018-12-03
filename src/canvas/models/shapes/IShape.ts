import { Point, TrackingPoint } from './point';

export interface IShape {

  Id: string;
  Top: number;
  Right: number;
  Bottom: number;
  Left: number;

  Width: number;
  Height: number;

  Center: Point;

  DrawShape(context: any);
 // Track(point: TrackingPoint);
//  HitTest(point: TrackingPoint);
}



