import { ContextLayer } from '../../../IContextItem';
import { Rectangle } from '../../../shapes/rectangle';
import { AxisLayer } from './axis/axis.layer';
import { StateIndex, UIStates } from '../../../DisplayValues'


// DataContent{
// page{ size:0,number:0}
// range{ min:0,max:0}
// data{ value:0,fieldId:''}[]
// 

export abstract class ContentLayer extends ContextLayer {

  constructor(width: number, height: number,layerId:string) {
    super(layerId, 'default');




  }

  Draw(context: any) {
    super.Draw(context);
  }
}
