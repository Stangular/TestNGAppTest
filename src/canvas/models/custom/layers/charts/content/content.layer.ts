import { ContextLayer } from '../../../../IContextItem';
import { Rectangle } from '../../../../shapes/rectangle';
import { AxisLayer } from '../axis/axis.layer';
import { StateIndex, UIStates } from '../../../../DisplayValues'
import { Margin } from '../../../../shapes/primitives/margin';
import { Size } from '../../../../shapes/primitives/size';
import { AppDataService } from '../../../../../../dataManagement/service/appData.service';
import { IScale } from '../axis/axis.layer'

// DataContent{
// page{ size:0,number:0}
// range{ min:0,max:0}
// data{ value:0,fieldId:''}[]
// 

export abstract class ContentLayer extends ContextLayer {

  constructor( margins: Margin, size: Size, layerId: string) {
    super(layerId, 'default');




  }

  abstract XScale(): IScale;
  abstract YScale(): IScale;

  Draw(context: any) {
    super.Draw(context);
  }
}
