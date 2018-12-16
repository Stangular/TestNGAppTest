import { ContextLayer } from '../../../../../IContextItem';
import { IContextItem } from '../../../../../IContextItem';
import { Rectangle } from '../../../../../shapes/rectangle';
import { Margin } from '../../../../../shapes/primitives/margin';
import { Size } from '../../../../../shapes/primitives/size';
import { Point } from '../../../../../shapes/primitives/point';
import { AxisLayer, IScale, NumericScale, TimeScale } from '../../axis/axis.layer';
import { StateIndex, UIStates } from '../../../../../DisplayValues'
import { ContentLayer } from '../content.layer';
//import { Records } from '../../../../../../../dataManagement/model/records';
import { AppDataService } from '../../../../../../../dataManagement/service/appData.service';


// DataContent{
// page{ size:0,number:0}
// range{ min:0,max:0}
// data{ value:0,fieldId:''}[]
// 

export class Bar implements IContextItem{
  bar: Rectangle;
  constructor(id: string,
    minValue: number,
    maxValue: number,
    value: number,
    size: Size,
    offset: number,
    width: number,
    state: StateIndex) {

    let h = ((value / maxValue) * size.Height);
    let t = size.Height - h;
    h -= 2;
    let l = offset + 5 ;
    this.bar = new Rectangle(id, t, l, width, h,state );
  }

  get Id(): string { return this.bar.Id; }

  Draw(context: any): void {
    this.bar.Draw(context);
  }
}

export class BarLayer extends ContentLayer {

  bars: Bar[] = [];
  //labeledData {label:string,param: string}
  constructor(
    minValue: number,
    maxValue: number,
    data: number[],
    margins: Margin,
    size: Size ) {
    super(margins,size, 'barchart');
 
    let barState = new StateIndex('barsss');
    barState.setState(UIStates.background, 2);
    barState.setState(UIStates.foreground, 1);
    barState.setState(UIStates.color, 4);
    barState.setState(UIStates.weight, 0);
    let barwidth = (size.Width / data.length) - 10;
    let offset = 0;
    let self = this;
    let chartSize = new Size(size.Width - margins.Right, size.Height - margins.Bottom);
    const origin: Point = new Point(margins.Left, size.Height);
    offset = margins.Left;
    data.forEach(function (d, i) {
      let bar = new Bar('barchart' + i, minValue, maxValue, d, chartSize, offset, barwidth, barState);
      offset += ( barwidth + 10 );
      self.AddContent(bar);
    });
    // height of chart area, xaxis base line, yaxis base line
    //  xparam as % of height = top;
    //  rHgt = baseline - top;
    //  width = increment - padding
    //  left = tick x position - bar width 

    // max value, min value  ( max - min )/hgt = count
    // 
  }

  XScale(): IScale {
    let xScale = new NumericScale(0, 100, 20, 5);
    return new NumericScale(0, 100, 20, 5);
  }

  YScale(): IScale {
    let xScale = new NumericScale(0, 100, 20, 5);
    return new NumericScale(0, 100, 20, 5);
  }
}
