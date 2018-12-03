import { Id3ChartModel } from './d3.model.interface';
import { Size, D3ChartModel } from './d3.common.model';


export class D3PieChartModel implements Id3ChartModel  {

  constructor() {}


  Draw(d3: any, id: string, size: Size, chart: D3ChartModel, offsetX: number = 0, offsetY: number = 0) {
    let r = size.Width / 2;
    let self = this;
    let y = 0;
    
    let svg = d3.select('#' + id)
      .data(chart.Sections);


    let grp = svg.append('g')
      .attr("transform", "translate(" + r + ',' + r + ")");

    let arc = d3.arc().innerRadius(r/2).outerRadius(r);
    let pie = d3.pie().sort(null).value(function (d) { return d.FieldValue('fld1') ; });

    let arcs = grp.selectAll(".arc")
      .data(pie(chart.Sections))
      .enter()
      .append("g").attr("class","arc");

    arcs.append("path")
      .attr("fill", function (d, i) { return chart.Sections[i].DefaultColor; })
      .attr("d", arc);
  }
}
