import { Size, Margin } from '../services/d3.common.model';
import { Field } from '../../dataManagement/model/field';
import { D3ChartAxisDataModel } from '../dataviewModel/dataStructure.model';

export class D3AxisModel {

  constructor() {
  }

  SetAxis(d3: any, width: number, height: number) {
  // this.YRange(d3, height);
  //  this.XRange(d3, width, height);
  }

  //XRange(d3: any, width: number, height: number) {
  //  const xScale = d3.scaleBand()
  //    .rangeRound([0, width])
  //    .domain(this._data.map((s) => s.xparam))
  //    .padding(0.2);

  //  this._chart.append('g')
  //    .attr('transform', `translate(0, ${height})`)
  //    .attr("color", "black")
  //    .call(d3.axisBottom(xScale));
  //}

  //YRange(d3: any, height: number) {
  //  const yScale = d3.scaleLinear().range([height, 0]);
  //  this._chart.append('g')
  //    .attr("color", "red")
  //    .call(d3.axisLeft(yScale));
  //  yScale.domain([0, d3.max(this._data, function (d) { return d.yparam; })]);
  //}
}



