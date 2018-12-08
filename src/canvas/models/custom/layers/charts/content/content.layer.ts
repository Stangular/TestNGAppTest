import { ContextLayer } from '../../../../IContextItem';
import { Rectangle } from '../../../../shapes/rectangle';
import { AxisLayer } from '../axis/axis.layer';
import { StateIndex, UIStates } from '../../../../DisplayValues'
import { Area } from '../../../../shapes/primitives/area';
import { Size } from '../../../../shapes/primitives/size';


// DataContent{
// page{ size:0,number:0}
// range{ min:0,max:0}
// data{ value:0,fieldId:''}[]
// 

export abstract class ContentLayer extends ContextLayer {

  constructor(margins: Area, size: Size,layerId:string) {
    super(layerId, 'default');




  }

  Draw(context: any) {
    super.Draw(context);
  }
}
