import { ContextLayer } from '../../../../../IContextItem';
import { Rectangle } from '../../../../../shapes/rectangle';
import { AxisLayer } from '../../axis/axis.layer';
import { StateIndex, UIStates } from '../../../../../DisplayValues'
import { ContentLayer } from '../content.layer';
import { forEach } from '@angular/router/src/utils/collection';


// DataContent{
// page{ size:0,number:0}
// range{ min:0,max:0}
// data{ value:0,fieldId:''}[]
// 

export class BarLayer extends ContentLayer {

  barState: StateIndex;
  //labeledData {label:string,param: string}
  constructor(width: number, height: number,
    private labels: { label: string, width: number, height: number, angle: number = 0 }[]
    private data: { xparam: string, yparam: number }[] = []) {
    super( width, height, 'barchart');
 
    this.barState = new StateIndex('barsss');
    this.barState.setState(UIStates.background, 2);
    this.barState.setState(UIStates.foreground, 1);
    this.barState.setState(UIStates.color, 4);
    this.barState.setState(UIStates.weight, 0);
  
    super.AddContent(new Rectangle('bar1', 10, 10, 50, 50, this.barState));

    // max value, min value  ( max - min )/hgt = count
    // 
  }
}
