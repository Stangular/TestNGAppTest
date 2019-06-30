import { ContextLayer } from '../../../../IContextItem';
import { Rectangle } from '../../../../shapes/rectangle';
import { AxisLayer } from '../axis/axis.layer';
import { StateIndex, UIStates } from '../../../../DisplayValues'
import { Margin } from '../../../../shapes/primitives/margin';
import { Size } from '../../../../shapes/primitives/size';
import { AppDataService } from '../../../../../../dataManagement/service/appData.service';
import { IScale } from '../axis/axis.layer'
import { Point } from 'src/canvas/models/shapes/primitives/point';
import { ShapeSelectResult } from 'src/canvas/models/shapes/shapeSelected';

// DataContent{
// page{ size:0,number:0}
// range{ min:0,max:0}
// data{ value:0,fieldId:''}[]
// 

export abstract class ContentLayer { // extends ContextLayer {

  constructor(protected margins: Margin, protected size: Size, layerId: string) {
   // super(layerId, 'default');
  }

  abstract XScale(): IScale;
  abstract YScale(): IScale;
  abstract positionOnAxis(axis: AxisLayer): void;

  get Margins() {
    return this.margins;
  }

  get Size() {
    return this.size;
  }

  Draw(context: any) {
 //   super.Draw(context);
  }

  Select(shapeSelectResult: ShapeSelectResult): boolean {
    return false; //super.Select(shapeSelectResult);
  }
}
