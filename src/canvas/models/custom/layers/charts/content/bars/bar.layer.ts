import { ContextLayer } from '../../../../../IContextItem';
import { IContextItem } from '../../../../../IContextItem';
import { Rectangle } from '../../../../../shapes/rectangle';
import { Area } from '../../../../../shapes/primitives/area';
import { Size } from '../../../../../shapes/primitives/size';

import { AxisLayer } from '../../axis/axis.layer';
import { StateIndex, UIStates } from '../../../../../DisplayValues'
import { ContentLayer } from '../content.layer';


// DataContent{
// page{ size:0,number:0}
// range{ min:0,max:0}
// data{ value:0,fieldId:''}[]
// 

export class Bar implements IContextItem{
  bar: Rectangle;
  constructor(id: string, value: number, margins: Area, size: Size, offset: number,
    width:number,
    state: StateIndex) {

    let h = (value / size.Height) * 100;
    let t = margins.Bottom - h;
    let l = margins.Left + offset;
    this.bar = new Rectangle(id, t, l, width, h,state );
  }

  get Id(): string { return this.bar.Id; }

  Draw(context: any): void {
    this.bar.Draw(context);
  }
}

export class BarLayer extends ContentLayer {

  barState: StateIndex;
  bars: Bar[] = [];
  //labeledData {label:string,param: string}
  constructor(margins: Area, size: Size,
    private labels: { label: string, width: number, height: number, angle: number }[],
    private data: { xparam: number, yparam: number }[] = []) {
    super( margins,size, 'barchart');
 
    this.barState = new StateIndex('barsss');
    this.barState.setState(UIStates.background, 2);
    this.barState.setState(UIStates.foreground, 1);
    this.barState.setState(UIStates.color, 4);
    this.barState.setState(UIStates.weight, 0);
    let barwidth = size.Width / this.data.length;
    let offset = 0;
    this.data.forEach(function (d, i) {
      let bar = new Bar('sss' + i, d.xparam, margins, size, offset, barwidth, this.barState);
      this.AddContent(bar);
    });
    // height of chart area, xaxis base line, yaxis base line
    //  xparam as % of height = top;
    //  rHgt = baseline - top;
    //  width = increment - padding
    //  left = tick x position - bar width 

    // max value, min value  ( max - min )/hgt = count
    // 
  }
}
