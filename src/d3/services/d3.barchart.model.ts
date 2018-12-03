import { Id3ChartModel } from './d3.model.interface';
import { Size, D3ChartModel } from './d3.common.model';


export class D3BarChartModel implements Id3ChartModel {

  constructor() {
  }

  private SetData(value: number, size: Size, chart: D3ChartModel ) {
    // orientation is always along largest dimension...
    let totalvalue = chart.TotalFieldValue();
    let D = (size.Height > size.Width) ? size.Height : size.Width;
    return D * (value / totalvalue);
  }

  Draw(d3: any, id: string, size: Size, chart: D3ChartModel, offsetX: number = 0, offsetY: number = 0) {
    let svg = d3.select('#' + id );
    let self = this; 
    let y = 0;
    
    svg.selectAll("rect")
      .data(chart.Sections)
      .enter()
      .append("rect")
      .attr("x", 10)
      .attr("y", function (d, i) { d.Offset = y; y = self.SetData(d.FieldValue('fld1'), size, chart); return d.Offset; })
      .attr("width", 10)
      .attr("height", function (d, i) { return self.SetData(d.FieldValue('fld1') , size, chart); })
      .attr("fill", function (d, i) { return d.DefaultColor; });

 //   y = 0;

  //  let x = 10 + size.Width / 4;
  //  let py = 0;
  //  svg.selectAll("text")
  //    .data(this._sections)
  //    .enter()
  //    .append("text")
  //    .text(function (d, i) { return self.SetData(d.Value) })
  //    .attr("text-anchor", "middle")
  //    .attr("x", x)
  //    .attr("y", function (d, i) { return d.Offset + (self.SetData(d.Value) / 2); })
  //    .attr("font-family", "sans-serif")
  //    .attr("font-size", "9px")
  //    .attr("fill", "white")
  //    .attr("transform", function (d, i) { return "rotate(90 " + x + "," + (d.Offset + (self.SetData(d.Value) / 2)) + ")" });
  }
}
