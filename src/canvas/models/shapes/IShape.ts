import { Point, TrackingPoint } from './primitives/point';
import { IContextItem } from '../IContextItem';
import { StateIndex } from '../DisplayValues';

export enum FreedomOfMotion {
  full = 0,
  horizontal = 1,
  vertical = 2
}
export enum AreaType {
  normal = 0, // width and height change independently
  lockedRatio = 1, // Ratio between width and height remains constant as other dimension changes.
  constantArea = 2 // Total area remains the same as width of height changes
}

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

  StateName: string;
  AreaType: AreaType;
  FreedomOfMotion: FreedomOfMotion;
  FreedomOfSizing: FreedomOfMotion;

  //DrawShape(context: any);
  MoveBy(x: number, y: number);
  SizeBy(context: any,top: number, right: number, bottom: number, left: number);
  CenterOn(x: number, y: number);
  SetProperties(properties: any);
  Select(criteria: any): boolean;
  StateIndex: StateIndex;
  Ports: IShape[];
 // Track(point: TrackingPoint);
//  SetToPosition(point: TrackingPoint);
}



