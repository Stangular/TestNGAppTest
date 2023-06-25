import { ContextLayer } from '../../IContextItem';
import { Shape } from '../../shapes/shape';
import { Rectangle } from '../../shapes/rectangle';
import { Ellipse } from '../../shapes/ellipse';
//import { TextShape } from '../../shapes/content/text/text';
import { Line } from '../../lines/line';
import { DisplayValues, StateIndex, UIStates } from '../../DisplayValues'
import { SimplePortRectangle } from '../shapes/SimplePortRectangle';
import { anglefactor } from '../../constants';

export class ExperimentalLayer { //extends ContextLayer {

  state1: StateIndex;
  state2: StateIndex;
  state3: StateIndex;
  linestate: StateIndex;

  constructor() {
   // super('experiment', 'default');

    this.state1 = new StateIndex('rect1');
    this.state1.setState(UIStates.background, 0);
    this.state1.setState(UIStates.foreground, 1);
    this.state1.setState(UIStates.weight, 0);

    this.state2 = new StateIndex('rect2');

    this.state2.setState(UIStates.background, 2);
    this.state2.setState(UIStates.foreground, 1);
    this.state2.setState(UIStates.weight, 0);

    this.state3 = new StateIndex('text1');
    this.state3.setState(UIStates.background, 3);
    this.state3.setState(UIStates.foreground, 1);
    this.state3.setState(UIStates.color, 4);
    this.state3.setState(UIStates.weight, 0);
    this.state3.setState(UIStates.fontFace, 0);

    //super.AddContent(new Rectangle('exc1', 10, 10, 50, 50, this.state1));
 //   super.AddContent(new Ellipse('exc2', 70, 70, 50, 50, this.state2));
    const a = 315 * anglefactor;
    //super.AddContent(new Text('text1a', 220, 10, 100, 16, this.state3, "text1a",  a ));
    //super.AddContent(new TextRight('text1b', 220, 50, 100, 16, this.state3, "text1b",  a));
    //super.AddContent(new TextCenter('text1c', 220, 100, 100, 16, this.state3, "text1c",  a));
    //super.AddContent(new Text('text1d', 220, 150, 100, 16, this.state3, "text1d",  a));

    //const p1 = new SimplePortRectangle('sss1', 70, 10, 50, 50, this.state1);
    //const p2 = new SimplePortRectangle('sss2', 10, 70, 50, 50, this.state1);
    //super.AddContent(p1);
    //super.AddContent(p2);

    this.linestate = new StateIndex('line1');
    this.linestate.setState(UIStates.background, 2);
    this.linestate.setState(UIStates.foreground, 1);
    this.linestate.setState(UIStates.color, 4);
    this.linestate.setState(UIStates.weight, 0);
  //  super.AddContent(new Line('sssline', p1.PortOffset(0), p2.PortOffset(0), this.linestate));

  }


}
