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
import { ShapeSelectResult } from 'src/canvas/models/shapes/shapeSelected';


// DataContent{
// page{ size:0,number:0}
// range{ min:0,max:0}
// data{ value:0,fieldId:''}[]
// 

export class Bar implements IContextItem{
  area: Rectangle;
  sourceID: string = '';
  constructor(sid: string,
    id: string,
    minValue: number,
    maxValue: number,
    value: number,
    size: Size,
    offset: number,
    width: number,
    state: StateIndex) {
    this.sourceID = sid;
    let h = ((value / maxValue) * size.Height);
    let t = size.Height - h;
    h -= 2;
    let l = offset;
    this.area = new Rectangle( id, t, l, width, h,state );
  }

  get Id(): string { return this.area.Id; }

  Draw(context: any): void {
    this.area.Draw(context);
  }

  CopyItem(newId: string) {
    return null;
  }

  Select(shapeSelectResult: ShapeSelectResult): boolean{
    if (this.area.Select(shapeSelectResult)) {
      shapeSelectResult.id = this.sourceID;
      shapeSelectResult.type = 'bar';
      return true;
    }
    return false;
  }
}

export class BarLayer extends ContentLayer {

 // bars: Bar[] = [];
  //labeledData {label:string,param: string}
  constructor(
    minValue: number,
    maxValue: number,
    idData: string [],
    data: number[],
    margins: Margin,
    size: Size ) {
    super(margins,size, 'barchart');
 
    let barState = new StateIndex('barsss');
    barState.setState(UIStates.background, 2);
    barState.setState(UIStates.foreground, 1);
    barState.setState(UIStates.color, 4);
    barState.setState(UIStates.weight, 0);
    let barcount = data.length;
    let w = size.Width - (margins.Left + margins.Right);
    let barwidth = (w / barcount);
    barwidth = (barwidth * 80) / 100;
    let offset = 0;
    let self = this;
    
    let chartSize = new Size(size.Width - margins.Right, size.Height - margins.Bottom);
    data.forEach(function (d, i) {
      let bar = new Bar(idData[i],'barchart' + i, minValue, maxValue, d, chartSize, offset, barwidth, barState);
      self.AddContent(bar);
    });
    
  }

  CreateContent( axis: AxisLayer) {

  }
  

  positionOnAxis(axis: AxisLayer) {

    this.content.forEach(function (c, i) {
      let bar = (<Bar>c);
      let tick = axis.XTicks.find(t => t.id == bar.sourceID);
      if (tick) {
        bar.area.positionOnTick(tick.point.X - (bar.area.Width / 2), 0);
      }
    });
  }

  XScale(): IScale {
    return new NumericScale(0, 100, 20, 5);
  }

  YScale(): IScale {
    return new NumericScale(0, 100, 20, 5);
  }
}
