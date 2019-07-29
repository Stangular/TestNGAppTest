import { Point, TrackingPoint } from './primitives/point';
import { IContextItem } from '../IContextItem';

export interface IShape extends IContextItem {

  Id: string;
  Top: number;
  Right: number;
  Bottom: number;
  Left: number;

  Width: number;
  Height: number;

  Center: Point;
  DrawShape(context: any);
  MoveBy(x: number, y: number);
  SizeBy(top: number, right: number, bottom: number, left: number);
  CenterOn(x: number, y: number);
  SetProperties(properties: any);
 // Track(point: TrackingPoint);
//  SetToPosition(point: TrackingPoint);
}



