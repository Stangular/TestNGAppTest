import { Size, Margin } from '../../../services/d3.common.model';
import { D3ChartAxisDataModel } from '../../dataStructure.model';
import { ID3SVGView } from '../../viewInterface.model';
import { Records } from '../../../../dataManagement/model/records';
import { Field } from '../../../../dataManagement/model/field';

export class TestNormalizedStackedHorizontalBarChart implements ID3SVGView { // Based on: https://bl.ocks.org/mbostock/3886394

  _margin: Margin = new Margin(20, 60, 30, 40);
  _size: Size = new Size(1000, 600);
  private _fields: Field<string>[]
  _data: {
    state: string,
    under_5: number,
    to_13: number,
    to_17: number,
    to_24: number,
    to_44: number,
    to_64: number,
    over_64: number,
    total: number
  }[] = [];

  constructor(records: Records<string>, private _viewId: string = 'testNormalizedStackedBarChart') {
    //this._fields = records.Fields;// TODO: Change this to do a look up against a cache of records...
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
    debugger;
    let data = [];
    //    this._margin.Set(40, 10, 20, 200);
    let w = this._size.Width - this._margin.Left - this._margin.Right;
    let h = this._size.Height - this._margin.Top - this._margin.Bottom;
    this._size.Set(w, h);


    let svg = d3.select('#' + this._viewId);
    let g = svg.append("g")
      .attr("transform", "translate(" + this._margin.Left + "," + this._margin.Top + ")");

    var xRange = d3.scaleBand()
      .rangeRound([0, this._size.Width])
      .padding(0.1)
      .align(0.1);

    var yRange = d3.scaleLinear()
      .rangeRound([this._size.Height, 0]);

    var zRange = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);



    let columns: any[] = [];
    this._data.length = 0;
    //this._fields.forEach(function (f, i) {
    //   columns.push(f.Data[0]);
    // });
    //  this._data.length = 0;
    let self = this;
    //for (let i = 0; i < this._fields[0].Data.length; i++) {
    //  let s = {
    //    state: this._fields[0].Value(i),
    //    under_5: parseInt(this._fields[1].Value(i)),
    //    to_13: parseInt(this._fields[2].Value(i)),
    //    to_17: parseInt(this._fields[3].Value(i)),
    //    to_24: parseInt(this._fields[4].Value(i)),
    //    to_44: parseInt(this._fields[5].Value(i)),
    //    to_64: parseInt(this._fields[6].Value(i)),
    //    over_64: parseInt(this._fields[7].Value(i)),
    //    total: 0
    //  };
    //  for (let x = 1; x < 8; x = x + 1) {
    //    s.total += parseInt(this._fields[x].Value(i));
    //  }
    //  columns.push(this._fields[0].Value(i));
    //  this._data.push(s);
    //}

    this._data.sort(function (a, b) { return a.under_5 / a.total > b.under_5 / b.total ? -1 : 1 });

    //let keys: string[] = [];
    //this._fields.slice(1).forEach(function (f, i) { keys.push(f.FieldId); });
    //var series = d3.stack()
    //  .keys(keys)
    //  .offset(d3.stackOffsetExpand)(this._data);


    xRange.domain(this._data.map(function (d) { console.error('state2:' + d.state); return d.state; }));
    zRange.domain(columns.slice(1));

    g.append("g")
      .selectAll("g")
    //  .data(series)
      .enter().append("g")
      .attr("fill", function (d) { return zRange(d.key); })
      .selectAll("rect")
      .data(function (d) { return d; })
      .enter().append("rect")
      .attr("width", xRange.bandwidth)
      .attr("x", function (d) { console.error('state:' + d.data.state); return xRange(d.data.state); })
      .attr("y", function (d) { console.error('d1:' + d[1]); return yRange(d[1]); })
      .attr("height", function (d) { return yRange(d[0]) - yRange(d[1]); })

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this._size.Height + ")")
      .call(d3.axisBottom(xRange));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(yRange).ticks(10, "%"));

    var legend = g.selectAll(".legend")
   //   .data(series)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function (d) { var d = d[d.length - 1]; return "translate(" + (xRange(d.data.state) + xRange.bandwidth()) + "," + ((yRange(d[0]) + yRange(d[1])) / 2) + ")"; });


    legend.append("line")
      .attr("x1", -6)
      .attr("x2", 6)
      .attr("stroke", "#000");

    legend.append("text")
      .datum(function (d) { return { id: d.key }; })
      .attr("x", 9)
      .attr("dy", "0.35em")
      .attr("fill", "#000")
      .style("font", "10px sans-serif")
      .text(function (d) { return d.id; });
  }
}
