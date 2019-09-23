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
  IsHit: boolean;
  DrawShape(context: any);
  MoveBy(x: number, y: number);
  SizeBy(context: any,top: number, right: number, bottom: number, left: number);
  CenterOn(x: number, y: number);
  SetProperties(properties: any);
  Select(criteria: any): boolean;
 // Track(point: TrackingPoint);
//  SetToPosition(point: TrackingPoint);
}



