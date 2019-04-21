import { IShape } from '../shapes/Ishape';
import { IContextItem, ContextSystem } from '../IContextItem';
import { ILine } from './Iline'
import { Line } from './line'
import { StateIndex } from '../DisplayValues'
import { Point } from '../shapes/primitives/point';
import { ShapeSelectResult } from '../shapes/shapeSelected';



export class Path implements IContextItem {

  _class: string = '';

  constructor(private id: string,
    private segments: ILine [] = []) { }

  get Id() { return this.id; }

  Add(line: ILine) {
    this.segments.push(line);
  }
  get Class(): string {
    return this._class;
  }

  AssignToClass(clss: string): void {
    this._class = clss;
  }

  UpdateContextState() { }

  Draw(context: any): void {

    context.beginPath();

    this.segments.forEach(function (s, i) { s.DrawLine( context ) });

    context.stroke();

    context.closePath();
  }

  CopyItem(newId: string) {
    return null;
  }

  Select(shapeSelectResult: ShapeSelectResult) {
    return false;
  }
}
