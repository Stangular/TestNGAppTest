import { Size, Margin } from '../../../services/d3.common.model';
import { D3ChartAxisDataModel } from '../../dataStructure.model';
import { ID3SVGView } from '../../viewInterface.model';
import { Records } from '../../../../dataManagement/model/records';
import { Field } from '../../../../dataManagement/model/field';

export class VBarChart implements ID3SVGView { // Based on: http://bl.ocks.org/d3noob/8952219
  //https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/

  _chart: any;
  _svg: any;
  _margin: Margin = new Margin(100, 100, 100, 100);
  _size: Size = new Size(1000, 700);
  _yScale: any;
  _xScale: any;
  //private _fields: Field<string>[] = [];
  _data: { xparam: string, yparam: number }[] = [];
  constructor(records: Records<string>, private _viewId: string = 'VBarChart') {
    this.Data(records);// TODO: Change this to do a look up against a cache of records...
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
  
  Data(records: Records<string>) {
    let f = records.Fields;
    for (let i = 0; i < f[0].Data.length; i++) {
      this._data.push({
        xparam: f[0].Value(i),
        yparam: parseInt(f[1].Value(i)),
      });
    }
  }

  Chart(d3: any) {
    this._svg = d3.select('#' + this._viewId);
    this._chart = this._svg.append("g")
      .attr("transform", "translate(" + this._margin.Left + "," + this._margin.Top + ")");
  }

  DataFromFields() {

  }

  SetAxis(d3: any, width: number, height: number) {
    this.YRange(d3, height);
    this.XRange(d3, width, height);
  }
  XRange(d3: any, width: number, height: number) {
    this._xScale = d3.scaleBand()
      .rangeRound([0, width])
      .domain(this._data.map((s) => s.xparam))
      .padding(0.2);

    this._chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr("color", "black")
      .call(d3.axisBottom(this._xScale));
  }

  YRange(d3: any, height: number) {
    this._yScale = d3.scaleLinear().range([height, 0])
    .domain([0, d3.max(this._data, function (d) { return d.yparam + 100; })]);
    this._chart.append('g')
      .attr("color", "red")
      .call(d3.axisLeft(this._yScale));
  }

  Draw(d3: any) {
    let w = this._size.Width - this._margin.Left - this._margin.Right;
    let h = this._size.Height - this._margin.Top - this._margin.Bottom;
    //   this._size.Set(w, h);

    this.Chart(d3);
    this.SetAxis(d3, w, h);

    const makeYLines = () => d3.axisLeft()
      .scale(this._yScale)

    this._chart.append('g')
      .attr('class', 'grid')
      .call(makeYLines()
        .tickSize(-w, 0, 0)
        .tickFormat('')
      );

    let self = this;
    // Bars...
    let bargroups = this._chart.selectAll()
      .attr('fill', 'lightblue')
      .data(this._data)
      .enter();

    // bargroups




    bargroups
      .append('rect')
      .attr('fill','blue')
      .attr('x', (s) => self._xScale(s.xparam))
      .attr('y', (s) => self._yScale(s.yparam))
      .attr('height', (s) => h - self._yScale(s.yparam))
      .attr('width', self._xScale.bandwidth())
      .on('click', function (actual, i) {
        alert(actual.yparam);
      })
      .on('mouseenter', function (actual, i) {
        d3.selectAll('.value')
          .attr('opacity', 0)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 0.6)
          .attr('x', (a) => self._xScale(a.xparam ))
          .attr('width', self._xScale.bandwidth())

        const y = self._yScale(actual.yparam)

        const line = self._chart.append('line')
          .attr('id', 'limit')
          .attr('stroke', '#FED966')
          .attr('stroke-width', 3)
          .attr('x1', 0)
          .attr('y1', y)
          .attr('x2', w)
          .attr('y2', y);

      })
      .on('mouseleave', function () {
        d3.selectAll('.value')
          .attr('opacity', 1)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .attr('x', (a) => self._xScale(a.xparam))
          .attr('width', self._xScale.bandwidth())

        self._chart.selectAll('#limit').remove()
        self._chart.selectAll('.divergence').remove()
      });



    this._svg.append('text')
      .attr('class','charttitle')
      .attr('x', w / 2 + this._margin.Left)
      .attr('y', this._margin.Top - 25)
      .attr('text-anchor', 'middle')
      .text('Base Bar Chart');

    this._svg.append('text')
      .attr('x', -(h / 2) - this._margin.Left)
      .attr('y', this._margin.Top / 2.4)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text('Y Values');

    this._svg.append('text')
      .attr('x', w / 2 + this._margin.Left)
      .attr('y', this._size.Height)
      .attr('text-anchor', 'middle')
      .text('X Values');

    bargroups
      .append('text')
      .attr('stroke', 'white')
      .attr('x', (a) => this._xScale(a.xparam) + this._xScale.bandwidth() / 2)
      .attr('y', (a) => this._yScale(a.yparam) + 15)
      .attr('text-anchor', 'middle')
      .text((a) => `${a.yparam}`)

  }
}
