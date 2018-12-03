import { IShape } from '../shapes/Ishape';
import { IContextItem, ContextSystem } from '../IContextItem';
import { ILine } from './Iline'
import { Line } from './line'
import { StateIndex } from '../DisplayValues'

export class Path implements IContextItem {

  constructor(private id: string,
    private segments: ILine [] = []) { }

  get Id() { return this.id; }

  Add(line: ILine) {
    this.segments.push(line);
  }
   
  Draw(context: any): void {

    context.beginPath();

    this.segments.forEach(function (s, i) { s.DrawLine( context ) });

    context.stroke();

    context.closePath();
  }
}
