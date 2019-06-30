import { ContextLayer } from '../../../IContextItem';
import { ContentLayer } from './content/content.layer';
import { Rectangle } from '../../../shapes/rectangle';
import { AxisLayer, Tick, NumericScale, TimeScale, TimeRangeType } from './axis/axis.layer';
import { StateIndex, UIStates } from '../../../DisplayValues';
import { anglefactor } from '../../../constants';
import { Area } from '../../../shapes/primitives/area';
import { Margin } from '../../../shapes/primitives/margin';
import { Size } from '../../../shapes/primitives/size';
import { ContentFactory } from './content/content.factory';
import { Point } from 'src/canvas/models/shapes/primitives/point';
import { ShapeSelectResult } from 'src/canvas/models/shapes/shapeSelected';


export class ChartLayer { //extends ContextLayer {

  axisLayer: AxisLayer;
  linestate: StateIndex;


  constructor(
    width: number, height: number,margins: Margin,
    xTick: Tick,yTick: Tick,
    chartName: string, chartId: string, state: StateIndex,
    private contentLayer: ContentLayer = null ) {


   // super(chartId, 'default');
   
    let size = new Size(width - margins.Right, height - margins.Bottom);
   // this.contentLayer = ContentFactory.getContent(chartId, margins, size);

    //let xScale = new NumericScale(0, 100, 20, 5);
    //let d1 = new Date();
    //let d2 = new Date(d1);
    //d2.setDate(25);

    //let yScale = new TimeScale(d1, d2, 1, TimeRangeType.day, ['S', 'M', 'T', 'W', 'T', 'F', 'S']);
    //let scale1 = { scale: xScale, width: 20, height: 16, angle: 0 };
    //let scale2 = { scale: yScale, width: 20, height: 16, angle: 0 };
    //let xTick = new Tick([scale1], 5, 0, 50);
    //let yTick = new Tick([scale2], 5, 0, 50);

    //this.linestate = new StateIndex('line1');
    //this.linestate.setState(UIStates.background, 5);
    //this.linestate.setState(UIStates.foreground, 3);
    //this.linestate.setState(UIStates.color, 3);
    //this.linestate.setState(UIStates.weight, 0);
    //this.linestate.setState(UIStates.fontFace, 0);
  //  super.AddContent(new Line('sssline', p1.PortOffset(0), p2.PortOffset(0), this.linestate));

      
    this.axisLayer = new AxisLayer(margins, size, xTick, yTick, state);

    if (this.contentLayer) {
      this.contentLayer.positionOnAxis(this.axisLayer);
    }

  }

  Select(shapeSelectResult: ShapeSelectResult): boolean {
    if (this.contentLayer) {
      return this.contentLayer.Select(shapeSelectResult);
    }
    return false;
  }

  Draw(context: any) {
    //this.axisLayer.Draw(context);
    //if (this.contentLayer) {
    //  this.contentLayer.Draw(context);
    //}
  }
}
