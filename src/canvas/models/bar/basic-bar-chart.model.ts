import { Records } from '../../../dataManagement/model/records';
import { ChartLayer } from '../custom/layers/charts/chart.layer';
import { Tick, IScale, Scale, NumericScale } from '../custom/layers/charts/axis/axis.layer';
import { StateIndex, UIStates } from '../DisplayValues';
import { BarLayer } from '../custom/layers/charts/content/bars/bar.layer';
import { Margin } from '../shapes/primitives/margin';
import { Size } from '../shapes/primitives/size';

export class BasicBarChartModel {


  constructor(private xField: string, private yField: string) { }


  ChartGraphic(width: number, height: number,
    chartName: string = '',
    source: Records<string>) {

    let fx = source.Fields.find(f => f.FieldId == this.xField);  //'date'
    let fy = source.Fields.find(f => f.FieldId == this.yField);   //'income'

    if (!fx || !fy) {
      return null;
    }
    let d: string = '';
    let r: string[] = [];
    let years: string[] = [];
    let months: string[] = [];

    for (let i = 0; i < fx.Data.length; i++) {
      d = fx.Value(i);
      // calculate percentage of total height -  x/H = (d/500)* H 
    }

    for (let i = 0; i < fx.Data.length; i++) {
      d = fx.Value(i);
      r = d.split('-')
      years.push(years.findIndex(y => y == r[0]) >= 0 ? '' : r[0]);
      months.push(r[1]);
    }
    let dateScale: any[] = [];
    dateScale.push({ scale: new Scale(months), width: 20, height: 16, angle: 0 });
    dateScale.push({ scale: new Scale(years), width: 20, height: 16, angle: 0 });
    let xTick = new Tick(dateScale, 5, 0, 50);

    let xScale = new NumericScale(0, 500, 50, 5);
    let scale1 = { scale: xScale, width: 20, height: 16, angle: 0 };

    let yTick = new Tick([scale1], 5, 0, 50);
    let chartstate: StateIndex;

    chartstate = new StateIndex('barchart');
    chartstate.setState(UIStates.background, 5);
    chartstate.setState(UIStates.foreground, 3);
    chartstate.setState(UIStates.color, 3);
    chartstate.setState(UIStates.weight, 0);
    chartstate.setState(UIStates.fontFace, 0);
    let margins = new Margin(10, 50, 10, 60);
    let chart: ChartLayer;

    //let bar = new BarLayer(0, 500, fy.Data, margins, new Size(width, height));
    //chart = new ChartLayer(
    //  width, height,
    //  margins, xTick, yTick, 'barchart', 'bc1',
    //  chartstate, bar);
    //return chart;
  }


  //SetDataView() {

  ////  this.axisModel = new D3AxisModel(this._fields);
  //}

  //get NewContent() {
  //  //let flds: string[] = [];
  //  //this._fields.find(f =>)

  //  //this.New.forEach(function (f, i) {
  //  //   this._fields.find(f =>)
  //  //});
  //  return this._fields;
  //}

  //OutputAll(): any{
  //  return {
  //    FormName: this.SourceID,
  //    RecordCount: 14,
  //    Content: this.testData
  //  };
  //}

  get testData() {


    //  let f = new BaseField({ fieldID: 'state', values: [] });
    //  data.push("AL, 310504, 552339, 259034, 450818, 1231572, 1215966, 641667");
    let id: string[] = [];
    id.push("1DB3E8BE-79DE-47F6-B78D-23482BBBF685");
    id.push("2DB3E8BE-79DE-47F6-B78D-23482BBBF685");
    id.push("3DB3E8BE-79DE-47F6-B78D-23482BBBF685");
    id.push("DDB3E8BE-79DE-47F6-B78D-23482BBBF685");
    id.push("4DB3E8BE-79DE-47F6-B78D-23482BBBF685");
    id.push("5DB3E8BE-79DE-47F6-B78D-23482BBBF685");
    id.push("6DB3E8BE-79DE-47F6-B78D-23482BBBF685");
    id.push("7DB3E8BE-79DE-47F6-B78D-23482BBBF685");
    id.push("8DB3E8BE-79DE-47F6-B78D-23482BBBF685");
    id.push("9DB3E8BE-79DE-47F6-B78D-23482BBBF685");
    id.push("EDB3E8BE-79DE-47F6-B78D-23482BBBF685");
    id.push("ADB3E8BE-79DE-47F6-B78D-23482BBBF685");
    id.push("BDB3E8BE-79DE-47F6-B78D-23482BBBF685");
    id.push("CDB3E8BE-79DE-47F6-B78D-23482BBBF685");

    let data: string[] = [];

    data.push("2013-01-01");
    data.push("2013-02-01");
    data.push("2013-03-01");
    data.push("2013-04-01");
    data.push("2013-05-01");
    data.push("2013-06-01");
    data.push("2013-07-01");
    data.push("2013-08-01");
    data.push("2013-09-01");
    data.push("2013-10-01");
    data.push("2013-11-01");
    data.push("2013-12-01");
    data.push("2014-01-01");
    data.push("2014-02-01");

    let ydata: number[] = [];

    ydata.push(53);
    ydata.push(165);
    ydata.push(269);
    ydata.push(344);
    ydata.push(376);
    ydata.push(410);
    ydata.push(421);
    ydata.push(405);
    ydata.push(376);
    ydata.push(359);
    ydata.push(392);
    ydata.push(433);
    ydata.push(455);
    ydata.push(478);

    let fields: any[] = [];



    fields.push({ fieldID: 'id', values: id });
    fields.push({ fieldID: 'date', values: data });
    fields.push({ fieldID: 'income', values: ydata });



    return fields;
    //  return data;
  }
}
