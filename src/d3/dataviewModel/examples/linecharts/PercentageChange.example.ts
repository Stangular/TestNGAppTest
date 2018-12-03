import { Size, Margin } from '../../../services/d3.common.model';
import { D3ChartAxisDataModel } from '../../dataStructure.model';
import { ID3SVGView } from '../../viewInterface.model';
import { Field } from '../../../../dataManagement/model/field';

export class PercentageChangeExample implements ID3SVGView { // Based on: https://bl.ocks.org/mbostock/c69f5960c6b1a95b6f78

  _margin: Margin;
  _size: Size;
  constructor(private _viewId: string = 'inventorybyarea200') {
    
  }

  IsView( viewId: string) {
    return this._viewId == viewId;
  }

  SetViewParameters(margin: Margin, size: Size) {
    if (this._margin) {
      this._margin.Set(margin.Top, margin.Right, margin.Bottom, margin.Left);
    }
    else {
      this._margin = new Margin(margin.Top, margin.Right, margin.Bottom, margin.Left);

    }
    if (this._size) {
      this._size.Set(size.Width, size.Height);
    }
    else {
      this._size = new Size(size.Width, size.Height);
    }
  }

  Draw(d3: any) {
  
    //let data = [];
    //if (fields.length < 2) {
    //  return;
    //}
    //let xfld = fields[0];
    //let yfld = fields[1];
    //for (let i = 0; i < xfld.Data.length; i++) {
    //  data.push({ fX: xfld.Value(i), fY: yfld.Value(i), alternate: [] });
    //}

    //let formatPercent = d3.format("+.0%"),

    //  formatChange = function (x) { return formatPercent(x - 1); },
    //  parseDate = d3.timeParse("%d-%b-%y");

    //let xRange = d3.scaleTime().range([0, this._size.Width]);
    //let yRange = d3.scaleLog().range([this._size.Height, 0]);

    //let xAxis = d3.axisBottom(xRange);

    //let yAxis = d3.axisLeft(yRange)
    //  .tickSize(-this._size.Width, 0)
    //  .tickFormat(formatChange);


    //let line = d3.line()
    //  .x(function (d, i) { return xRange(d.fX); })
    //  .y(function (d, i) { return yRange(d.alternate[0]); });

    //let svg = d3.select('#' + this._viewId)
    //  .attr("width", this._size.Width + this._margin.Left + this._margin.Right)
    //  .attr("height", this._size.Height + this._margin.Top + this._margin.Bottom)
    //  .append("g")
    //  .attr("transform", "translate(" + this._margin.Left + "," + this._margin.Top + ")");

    //let gX = svg.append("g")
    //  .attr("class", "axis axis--x")
    //  .attr("transform", "translate(0," + this._size.Height + ")");

    //let gY = svg.append("g")
    //  .attr("class", "axis axis--y");

    //gY.append("text")
    //  .attr("class", "axis-title")
    //  .attr("transform", "rotate(-90)")
    //  .attr("y", 6)
    //  .attr("dy", ".71em")
    //  .text("Change in Price");

    //// Compute price relative to base value (hypothetical purchase price).
    //// var baseValue = +data[0].close;
    //data.forEach(function (d) {
    //  d.fX = parseDate(d.fX);
    //});

    //data.forEach(function (d) {
    //  d.alternate.push( d.fY / data[0].fY);
    //});

    //xRange.domain(d3.extent(data, function (d, i) { return d.fX; }));
    //yRange.domain(d3.extent(data, function (d, i) { return d.alternate[0]; }));

    //// Use a second linear scale for ticks.
    //yAxis.tickValues(d3.scaleLinear()
    //  .domain(yRange.domain())
    //  .ticks(20));

    //gX.call(xAxis);

    //gY.call(yAxis)
    //  .selectAll(".tick")
    //  .classed("tick--one", function (d) { return Math.abs(d - 1) < 1e-6; });


    //svg.append("path")
    //  .datum(data)
    //  .attr("class", "line")
    //  .style("stroke", "blue")
  //    .style("fill", "none")
  //    .attr("d", line);
  }

}
