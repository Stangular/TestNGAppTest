import { IShape } from '../shapes/Ishape';
import { IContextItem, ContextSystem } from '../IContextItem';
import { ILine } from './Iline'
import { Line } from './line'
import { StateIndex } from '../DisplayValues'
import { Point } from '../shapes/primitives/point';
import { ShapeSelectResult } from '../shapes/shapeSelected';
import { Port } from '../shapes/port';


//export class Path {
//  private portNames: string[] = [];
//  constructor(private id: string, private line: string) { }

//  get Id() { return this.id; }
//  get Line() { return this.line; }
//  AddPort(port: string) {
//    this.portNames.push(port);
//  }
//}


export class Path implements IContextItem {

  nodeCount: number = 0;
  private portNames: string[] = [];
  constructor(private id: string
    , private line: string) { }

  get Id() { return this.id; }

  get Line() { return this.line; }

  AddPort(port: string) {
    this.portNames.push(port);
  }
  get zIndex() { return 0;}
  get Ports() {
    return this.portNames;
  }

  DrawLine(context: any, ports: Port[], line: Line) {
    //if (this.portNames.length < 2) { return; }
    //let port = ports.find(p => p.Id == this.portNames[0]);
    //port.DrawSource(context);
    //for (let i = 1; i < this.portNames.length; i += 1) {
    //  port = ports.find(p => p.Id == this.portNames[i]);
    //  port.DrawTarget(context);
    //}
    //line.Draw(context);
  }

  Save(): any {
    return {};
  }

  UpdateContextState() { }

  Draw(context: any): void {

  //  context.beginPath();

   // this.segments.forEach(function (s, i) { s.DrawLine( context ) });

   // context.stroke();

   // context.closePath();
  }

  CopyItem(newId: string) {
    return null;
  }

  Select(shapeSelectResult: ShapeSelectResult) {
    return false;
  }
}
