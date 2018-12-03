import { Size, D3ChartModel } from './d3.common.model';

export interface Id3ChartModel {
  Draw(d3: any, id: string, size: Size, chart: D3ChartModel );
}
