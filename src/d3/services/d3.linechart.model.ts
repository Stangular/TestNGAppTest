import { Id3ChartModel } from './d3.model.interface';
import { Size, D3ChartModel } from './d3.common.model';

export class D3LineChartModel implements Id3ChartModel {


 // d3AxisModel: D3AxisModel = new D3AxisModel();
  constructor() {
  }

  //Draw(d3: any, id: string, size: Size, chart: D3ChartModel) {
  //  //  let r = 300;
  //  console.error('drawsss');
  //  //  let r = 300;
  //  let self = this;

  //  let margin = { top: 20, right: 20, bottom: 30, left: 50 };
  //  let width = 600 - margin.left - margin.right;
  //  let height = 400 - margin.top - margin.bottom;

  //  let svg = d3.select('#' + id);
  //  let g = svg.append('g')
  //    .attr('transform', 'translate(50,20)');

  //  let x = d3.scaleLinear().rangeRound([0, width]);
  //  let y = d3.scaleLinear().rangeRound([height, 0]);
  //  let line = d3.line()
  //    .x(function (d) { return x(d.FieldValue('axX')); })
  //    .y(function (d) { return y(d.FieldValue('axY')); });

  //  x.domain(d3.extent(chart.Sections, function (d) { return d.FieldValue('axX') }));
  //  y.domain(d3.extent(chart.Sections, function (d) { return d.FieldValue('ax') }));

  //  g.append("g")
  //    .attr("transform", 'translate(0,' + height + ')')
  //    .call(d3.axisBottom(x))
  //    .select(".domain")
  //    .remove();

  //  g.append("g")
  //    .call(d3.axisLeft(y));


  //  //let xAx = d3.axisBottom(x);

  //  //let yAx = d3.axisLeft(y);



  //  g.append("path")
  //    .datum(chart.Sections)
  //    .attr("class", "linesss")
  //    .style("stroke", "blue")
  //    .style("fill", "none")
  //    .attr("d", line);


  //}

  Draw(d3: any, id: string, size: Size, chart: D3ChartModel, offsetX: number = 0, offsetY: number = 0) {
    //  let r = 300;


   // this.d3AxisModel.drawVertical();
    //let self = this;

    //let margin = { top: 20, right: 20, bottom: 30, left: 50 };
    //let width = size.Width - margin.left - margin.right;
    //let height = size.Height - margin.top - margin.bottom;

    //let svg = d3.select('#' + id);
    //let g = svg.append('g')
    //  .attr('transform', 'translate(50,20)');

    //let x = d3.scaleLinear().rangeRound([0, width]);
    //let y = d3.scaleLinear().rangeRound([height, 0]);
    //let line = d3.line()
    //  .x(function (d) { return x(d.FieldValue('axX')); })
    //  .y(function (d) { return y(d.FieldValue('axY')); });

    //x.domain(d3.extent(chart.Sections, function (d) { return d.FieldValue('axX') }));
    //y.domain(d3.extent(chart.Sections, function (d) { return d.FieldValue('axY') }));

    //g.append("g")
    //  .attr("transform", 'translate(0,' + height + ')')
    //  .call(d3.axisBottom(x))
    //  .select(".domain")
    //  .remove();

    //g.append("g")
    //  .call(d3.axisLeft(y));


    ////let xAx = d3.axisBottom(x);

    ////let yAx = d3.axisLeft(y);



    //g.append("path")
    //  .datum(chart.Sections)
    //  .attr("class", "linesss")
    //  .style("stroke", "blue")
    //  .style("fill", "none")
    //  .attr("d", line);


  }
}
/*
 * DrawSSS(d3: any, id: string) {
    console.error('drawsss');
    //  let r = 300;
    let self = this;

     let margin = { top: 20, right: 20, bottom: 30, left: 50 };
    let width = 600 - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;

    let svg = d3.select('#' + id);
    let g = svg.append('g')
      .attr('transform', 'translate(50,20)');

    let x = d3.scaleLinear().rangeRound([0, width]);
    let y = d3.scaleLinear().rangeRound([height, 0]);
    let line = d3.line()
      .x(function (d) { return x(d.FieldValue('fld1')); })
      .y(function (d) { return y(d.FieldValue('fld2')); });

    x.domain(d3.extent(self._sections, function (d) { return d.FieldValue('fld1') } ));
    y.domain(d3.extent(self._sections, function (d) { return d.FieldValue('fld2') }));

    g.append("g")
      .attr("transform", 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .select(".domain")
      .remove();

    g.append("g")
      .call(d3.axisLeft(y));


    //let xAx = d3.axisBottom(x);

    //let yAx = d3.axisLeft(y);



    g.append("path")
      .datum(self._sections)
      .attr("class", "linesss")
      .style("stroke", "blue")
      .style("fill", "none")
      .attr("d", line);


  }
 * */
