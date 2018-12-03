import { ContextLayer } from '../../../IContextItem';
import { ContentLayer } from './content/content.layer';
import { Rectangle } from '../../../shapes/rectangle';
import { AxisLayer } from './axis/axis.layer';
import { StateIndex, UIStates } from '../../../DisplayValues'



export class ChartLayer extends ContextLayer {

  axisLayer: AxisLayer;
  contentLayer: ContentLayer;

  constructor(width: number, height: number,charId:string) {
    super(charId, 'default');
    this.axisLayer = new AxisLayer(width, height);
    


  }

  Draw(context: any) {
    this.axisLayer.Draw(context);
    this.contentLayer.Draw(context);
  }
}
