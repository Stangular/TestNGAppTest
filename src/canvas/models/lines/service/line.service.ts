import { Injectable } from '@angular/core';
import { Line } from '../line';
import { Point } from '../../shapes/primitives/point';
import { StateIndex, UIStates, DisplayValues } from '../../DisplayValues';
import { Port } from '../../shapes/port';


@Injectable()
export class LineService {

  _lines: Line[] = [];
  _currentLine: number = -1;
  private linepad = new StateIndex('linepad');

  constructor() {
    this.linepad.setState(UIStates.foreground, 1);
    this.linepad.setState(UIStates.color, 4);
    this.linepad.setState(UIStates.weight, 0);

    this.AddLine('basic_line_A', 'basic','');

  }

  AddPath(line: Line, pathName: string) {
    if (!line) { return false;}
    //let path = line.Paths.find(p => p.Id == pathName);
    //if (!path) {
    //  line.AddPath(pathName);  
    //}
    return true;
  }

  AddLine(id: string,state:string,pathName:string) {
    if (!id || id.length <= 0) { return false; }
    let line = this._lines.find(l => l.Id == id);
    if (!line) {
      line = new Line(id,state);
      this._lines.push(line);
    }
    this.AddPath(line, pathName);
    return true;
  }

  AddPortToLine(lineName:string,pathName:string,portIndex:number) {
    let line = this._lines.find(l => l.Id == lineName);
    if (line) {
     // return line.AddPortToLine(pathName,portIndex);
    }
    return false;
  }

  get CurrentLine() {
    return this._currentLine;
  }

  SelectLine(id: string): boolean {
    this._currentLine = this._lines.findIndex(l => l.Id == id);
    return this._currentLine >= 0;
  }

  public DrawLines(context: any, port: Port): void {
    //let lines = this._lines.filter(l => l.Id == port.SourcePort);
    //lines.forEach(function (l, i) {
      
    //});
  }

 
}

