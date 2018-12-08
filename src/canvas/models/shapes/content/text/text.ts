import { IShape } from '../../IShape';
import { Shape } from '../../shape';
import { IContextItem, ContextSystem } from '../../../IContextItem';
import { DisplayValues, StateIndex, UIStates } from '../../../DisplayValues'



export class Text extends Shape implements IContextItem {

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    state: StateIndex,
    protected text: string,
    private angle: number = 0) {
    super(id,
      top,
      left,
      width,
      height,
      state);
  }

  align(context: any) {
    context.textAlign = 'left';
    context.fillText(this.text, 0, this.Height); 
  }
  DrawShape(context: any): void {

    context.save();
    context.translate(this.Left, this.Top);
    context.rotate(this.angle);
    context.rect(0, 0, this.Width, this.Height);
    context.fillStyle = DisplayValues.GetColor(this.state.Index[UIStates.background]);
    context.fill();
  //  context.lineWidth = 5; //DisplayValues.GetWeight(this.state.Index[UIStates.weight]);
    context.strokeStyle = DisplayValues.GetColor(this.state.Index[UIStates.foreground]);

    context.font = this.Height + "px " + DisplayValues.GetFont(this.state.Index[UIStates.fontFace]);
    context.textBaseline = 'bottom';
    context.textAlign = 'left';
    context.fillStyle = DisplayValues.GetColor(this.state.Index[UIStates.color]);
    this.align(context);
    context.strokeStyle = 'transparent';
    context.lineWidth = 1;
    context.stroke();
    context.restore();

  }

  Draw(context: any): void {

    context.beginPath();

    this.DrawShape(context);
    context.closePath();
  }
}

export class TextCenter extends Text {

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    state: StateIndex,
    text: string,
    angle: number = 0) {
    super(id,
      top,
      left,
      width,
      height,
      state,
      text,
      angle);
  }

  align(context: any) {
    context.textAlign = 'center';
    context.fillText(this.text, this.Width/2, this.Height);
  }
}

export class TextRight extends Text {

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    state: StateIndex,
    text: string,
    angle: number = 0) {
    super(id,
      top,
      left,
      width,
      height,
      state,
      text,
      angle);
  }

  align(context: any) {
    context.textAlign = 'right';
    context.fillText(this.text, this.Width, this.Height);
  }
}
