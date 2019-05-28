import { Injectable } from '@angular/core';
import { Point } from '../../shapes/primitives/point';
import { StateIndex, UIStates, DisplayValues } from '../../DisplayValues';
import { Port } from '../port';
import { Shape } from '../shape';
import { Line } from '../../lines/line';

@Injectable()
export class PortService {

  _ports: Port[] = [];
  _currentPort: number = -1;
  private portpad = new StateIndex('portpad');

  constructor() {
    this.portpad.setState(UIStates.foreground, 1);
    this.portpad.setState(UIStates.color, 4);
    this.portpad.setState(UIStates.weight, 0);
  }

  AddPort(
    id: string,
    offsetX: number,
    offsetY: number,
    parent: Shape) {
    if (!parent) { return -1; }
    let state = DisplayValues.GetPortIndex(id + "_state", "base_port_bg", "base_port_border");
    this._ports.push(new Port(id, offsetX,offsetY, parent, state));
    return this._ports.length - 1;
  }

  get CurrentPort() {
    return this._currentPort;
  }

  SelectPort(id: string): boolean {
    this._currentPort = this._ports.findIndex(l => l.Id == id);
    return this._currentPort >= 0;
  }

  //public MoveTo(context: any, line: Line): void {
  //  let ports = this._ports.filter(p => p.SourcePort == line.Id);
  //  ports.forEach(p => p.DrawLine(context));
  //}

  //public DrawPorts(context: any, shape: Shape): void {
  //  let ports = this._ports.filter(p => p.ParentShape == shape.Id);

  //  ports.forEach(function (p, i) {
  //    p.DrawShape(context);
  //  });


  //}
}

