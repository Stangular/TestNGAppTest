import { Size, Margin } from '../../../services/d3.common.model';
import { D3ChartAxisDataModel } from '../../dataStructure.model';
import { ID3SVGView } from '../../viewInterface.model';
import { Field } from '../../../../dataManagement/model/field';

export class MultiSeriesLineChartExample implements ID3SVGView { // Based on: https://bl.ocks.org/mbostock/c69f5960c6b1a95b6f78

  _margin: Margin;
  _size: Size;
  constructor(private _viewId: string = 'multiSeriesLineChartExample') {

  }

  IsView(viewId: string) {
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
    //let svg = d3.select('#' + this._viewId);
    //let w = this._size.Width - this._margin.Left - this._margin.Right;
    //let h = this._size.Height - this._margin.Top - this._margin.Bottom;
    //this._size.Set(w,h);
    //let g = svg.append("g").attr("transform", "translate(" + this._margin.Left + "," + this._margin.Top + ")");

    //let parseTime = d3.timeParse("%Y%m%d");

    //let xRange = d3.scaleTime().range([0, this._size.Width]);

    //let yRange = d3.scaleLinear().range([this._size.Height, 0]);

    //let z = d3.scaleOrdinal(d3.schemeCategory10);

    //var line = d3.line()
    //  .curve(d3.curveBasis)
    //  .x(function (d) { return xRange(d.date); })
    //  .y(function (d) { return yRange(d.temperature); });
    //    let gy = svg.append("g");

    //var cities = [];

    //for (let i = 1; i < fields.length; i = i + 1) {
    //  let f = fields[i];
    //  let city = { id: f.FieldId, values: [] };
    //  f.Data.forEach(function (d, j) {
    //    city.values.push({ date: parseTime(fields[0].Value(j)), temperature: d });
    //  });
    //  cities.push(city);
    //}

    //yRange.domain([
    //  d3.min(cities, function (c) { return d3.min(c.values, function (d) { return d.temperature; }); }),
    //  d3.max(cities, function (c) { return d3.max(c.values, function (d) { return d.temperature; }); })
    //]);
    //xRange.domain(d3.extent(fields[0].Data, function (d, i) { return parseTime(d); }));

    ////z.domain(cities.map(function (c) { return c.id; }));

    //g.append("g")
    //  .attr("class", "axis axis--x")
    //  .attr("transform", "translate(0," + this._size.Height + ")")
    //  .call(d3.axisBottom(xRange));

    //g.append("g")
    //  .attr("class", "axis axis--y")
    //  .call(d3.axisLeft(yRange))
    //  .append("text")
    //  .attr("transform", "rotate(-90)")
    //  .attr("y", 6)
    //  .attr("dy", "0.71em")
    //  .attr("fill", "#000")
    //  .text("Temperature, ºF");

    //var city = g.selectAll(".city")
    //  .data(cities)
    //  .enter().append("g")
    //  .attr("class", "city");

    //city.append("path")
    //  .attr("class", "line")
    //  .attr("d", function (d) { return line(d.values); })
    //  .style("stroke", function (d) { return z(d.id); })
    //  .style("fill", "none");

    //city.append("text")
    //  .datum(function (d) { return { id: d.id, value: d.values[d.values.length - 1] }; })
    //  .attr("transform", function (d) { return "translate(" + xRange(d.value.date) + "," + yRange(d.value.temperature) + ")"; })
    //  .attr("x", 3)
    //  .attr("dy", "0.35em")
    //  .style("font", "10px sans-serif")
    //  .text(function (d) { return d.id; });

  }

}
