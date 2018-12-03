import { Shape } from '../../shapes/shape';
import { IContextItem, ContextSystem } from '../../IContextItem';
import { DisplayValues, StateIndex, UIStates } from '../../DisplayValues'
import { Rectangle } from '../../shapes/rectangle';
import { Ellipse } from '../../shapes/ellipse';
import { Port } from '../../shapes/port';
import { Point } from '../../shapes/point';

export class SimplePort extends Port {
  constructor(id: string, top: number, left: number, state: StateIndex, offset: Point) {
    const t = offset.Y - 5;
    const l = offset.X - 5;
    super(new Ellipse(id + '_portA', t,l , 10, 10, state), offset);
  }
}

export class SimplePortRectangle extends Rectangle implements IContextItem {

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    state: StateIndex) {
    super(id,
      top,
      left,
      width,
      height,
      state);
    const c = this.Center;
    this._ports.push(new SimplePort(this.Id + '_portA', this.Top, this.Left, state, c));
  }

  PortOffset(index: number = 0) { return this._ports[index].Offset; }
}
