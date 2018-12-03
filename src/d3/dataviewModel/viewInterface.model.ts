import { Size, Margin } from '../services/d3.common.model';
import { D3ChartAxisDataModel } from './dataStructure.model';
import { Field } from '../../dataManagement/model/field';

export interface ID3SVGView {
  IsView(viewId: string);
  SetViewParameters(margin: Margin, size: Size);
  Draw(d3: any);
}
