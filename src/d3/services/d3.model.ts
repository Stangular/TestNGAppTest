import { Id3ChartModel } from './d3.model.interface';
import { Size, D3ChartSectionModel, D3ChartModel, ValuePair } from './d3.common.model';
import { D3BarChartModel } from './d3.barchart.model';
import { D3PieChartModel } from './d3.piechart.model';
import { D3LineChartModel } from './d3.linechart.model';
import { D3AxisModel } from '../axis/d3.axis.model';
import { Records } from '../../dataManagement/model/records';
import { Field, BaseField } from '../../dataManagement/model/field';
import { DataHTTPService } from '../../dataManagement/service/dataHTTP.service';
import { ChartLayer } from '../../canvas/models/custom/layers/charts/chart.layer';

export class D3ModelContainer { //extends Records<string> {
  _data: D3ChartModel[] = [];
  _charts: Id3ChartModel[] = [];
  _size: Size = new Size(0, 0);
  private d3BarChartModel: D3BarChartModel = new D3BarChartModel();
  private d3LineChartModel: D3LineChartModel = new D3LineChartModel();
  private d3PieChartModel: D3PieChartModel = new D3PieChartModel();



  constructor() {
  //  super('testtable1'); // this.TestData();

  }



  ChartData(chartID: string): { xparam: number, yparam: number }[] {
    let data: { xparam: number, yparam: number }[];
    //if (chartID == 'bar') {
    //  let fx = this.Fields.find(f => f.FieldId == 'date');
    //  let fy = this.Fields.find(f => f.FieldId == 'income');
    //  for (let i = 0; i < fx.Data.length; i++) {
    //    data.push({
    //      xparam: fx[0].Value(i),
    //      yparam: parseInt(fy[1].Value(i)),
    //    });
    //  }
    //}
    return data;
  }


  ChartIDFrom(chartNumber: number) {

  }

  ChartGraphic(chartID: string, width: number, height: number, chartName: string = ''): ChartLayer {
    return null;
  }

  Draw(d3: any, idsss: string, chartType: string, width: number, height: number, offsetX: number = 0, offsetY: number = 0) {

   // console.error(idsss);
   // console.error("W:" + width);
   // console.error("H:" + height);
   //console.error(idsss);
   // console.error(chartType);
   //console.error(JSON.stringify(this._data));
    this._size.Set(width, height);
    let chart = this._data.find(c => c.ChartID == idsss);
    if (!chart) {
      return;
    }
    switch (chartType) {
      case 'pie': this.d3PieChartModel.Draw(d3, idsss, this._size, chart, offsetX, offsetY); break;
      case 'bar': this.d3BarChartModel.Draw(d3, idsss, this._size, chart, offsetX, offsetY); break
      case 'line': this.d3LineChartModel.Draw(d3, idsss, this._size, chart, offsetX, offsetY); break;
    }
  }

  AddChartModels() {
    this._charts.push(new D3PieChartModel())
  }

  UpdateDependentUI(): void {

  }

  GetUIValue(fieldID: string): any {
  //  return this._form.controls[fieldID].value;
  }

  New(data: any): Field<any> {
    return new BaseField(data);
  }

  public GetFormDefinition() {
   // return this._UIElements;
  }

  OutputAll(): any {
    //return {
    //  FormName: this.SourceID,
    //  RecordCount: 14,
    //  Content: this.testData
    //};
  }

  get testData() {
    let fields: Field<string>[] = [];
    return fields;
  }
  //TestData() {

  //  let values1: ValuePair[] = [];
  //  values1.push(new ValuePair('axX', 1));
  //  values1.push(new ValuePair('axY', 2));

  //  let values2: ValuePair[] = [];
  //  values2.push(new ValuePair('axX', 2));
  //  values2.push(new ValuePair('axY', 4));

  //  let values3: ValuePair[] = [];
  //  values3.push(new ValuePair('axX', 3));
  //  values3.push(new ValuePair('axY', 1));

  //  let values4: ValuePair[] = [];
  //  values4.push(new ValuePair('axX', 4));
  //  values4.push(new ValuePair('axY', 5));

  //  let values5: ValuePair[] = [];
  //  values5.push(new ValuePair('axX', 5));
  //  values5.push(new ValuePair('axY', 3));

  //  let sections: D3ChartSectionModel[] = [];
  //  sections.push(new D3ChartSectionModel('1', '#ae34dd', '#dd34ea',  values1));
  //  sections.push(new D3ChartSectionModel('2', '#df23aa', '#aa32fd', values2));
  //  sections.push(new D3ChartSectionModel('3', '#df23aa', '#aa32fd',  values3));
  //  sections.push(new D3ChartSectionModel('4', '#df23aa', '#aa32fd', values4));
  //  sections.push(new D3ChartSectionModel('5', '#df23aa', '#aa32fd', values5));

  //  this._data.push(new D3ChartModel('inventorysummanrbyarea', sections));


  //  let values11: ValuePair[] = [];
  //  values1.push(new ValuePair('axX', 10));
  //  values1.push(new ValuePair('axY', 20));

  //  let values21: ValuePair[] = [];
  //  values2.push(new ValuePair('axX', 20));
  //  values2.push(new ValuePair('axY', 4));

  //  let values31: ValuePair[] = [];
  //  values3.push(new ValuePair('axX', 3));
  //  values3.push(new ValuePair('axY', 10));

  //  let values41: ValuePair[] = [];
  //  values4.push(new ValuePair('axX', 40));
  //  values4.push(new ValuePair('axY', 50));

  //  let values51: ValuePair[] = [];
  //  values5.push(new ValuePair('axX', 50));
  //  values5.push(new ValuePair('axY', 34));

  //  let values12: ValuePair[] = [];
  //  values1.push(new ValuePair('axX', 21));
  //  values1.push(new ValuePair('axY', 22));

  //  let values22: ValuePair[] = [];
  //  values2.push(new ValuePair('axX', 32));
  //  values2.push(new ValuePair('axY', 34));

  //  let values32: ValuePair[] = [];
  //  values3.push(new ValuePair('axX', 43));
  //  values3.push(new ValuePair('axY', 41));

  //  let values42: ValuePair[] = [];
  //  values4.push(new ValuePair('axX', 54));
  //  values4.push(new ValuePair('axY', 75));

  //  let values52: ValuePair[] = [];
  //  values5.push(new ValuePair('axX', 5));
  //  values5.push(new ValuePair('axY', 3));
  //  let sections1: D3ChartSectionModel[] = [];
  //  sections.push(new D3ChartSectionModel('1', '#ae34dd', '#dd34ea', values11));
  //  sections.push(new D3ChartSectionModel('2', '#df23aa', '#aa32fd', values21));
  //  sections.push(new D3ChartSectionModel('3', '#df23aa', '#aa32fd', values31));
  //  sections.push(new D3ChartSectionModel('4', '#df23aa', '#aa32fd', values41));
  //  sections.push(new D3ChartSectionModel('5', '#df23aa', '#aa32fd', values51));
  //  sections.push(new D3ChartSectionModel('1', '#ae34dd', '#dd34ea', values12));
  //  sections.push(new D3ChartSectionModel('2', '#df23aa', '#aa32fd', values22));
  //  sections.push(new D3ChartSectionModel('3', '#df23aa', '#aa32fd', values32));
  //  sections.push(new D3ChartSectionModel('4', '#df23aa', '#aa32fd', values42));
  //  sections.push(new D3ChartSectionModel('5', '#df23aa', '#aa32fd', values52));


  //  this._data.push(new D3ChartModel('inventorysummanrbyarea2', sections1));

  //  values3 = [];
  //  values3.push(new ValuePair('fld1', 30));

  //  values4 = [];
  //  values4.push(new ValuePair('fld1', 40));


  //  values5 = [];
  //  values5.push(new ValuePair('fld1', 10));
  //  sections = [];
  //  sections.push(new D3ChartSectionModel('top', '#ae34dd', '#dd34ea', values3));
  //  sections.push(new D3ChartSectionModel('btm', '#df23aa', '#aa32fd', values4));
  //  sections.push(new D3ChartSectionModel('sss', '#df00aa', '#aa32fd', values5));


  //  this._data.push(new D3ChartModel('inventorybyarea100', sections));
  //  this._data.push(new D3ChartModel('inventorybyarea101', sections));
  //  this._data.push(new D3ChartModel('inventorybyarea104', sections));
  //  this._data.push(new D3ChartModel('inventorybyarea103', sections));
  //  values3 = [];
  //  values3.push(new ValuePair('fld1', 30));

  //  values4 = [];
  //  values4.push(new ValuePair('fld1', 40));

  //  values2= [];
  //  values2.push(new ValuePair('fld1', 40));


  //  values5 = [];
  //  values5.push(new ValuePair('fld1', 10));
  //  sections = [];

  //  let values6 = [];
  //  values6.push(new ValuePair('fld1', 10));
  //  sections = [];
  //  sections.push(new D3ChartSectionModel('top', '#ae34dd', '#dd34ea', values3));
  //  sections.push(new D3ChartSectionModel('btm', '#df23aa', '#aa32fd', values4));
  //  sections.push(new D3ChartSectionModel('sss', '#aa23aa', '#aa32fd', values5));
  //  sections.push(new D3ChartSectionModel('sss2', '#df23df', '#aa32fd', values6));


  //  this._data.push(new D3ChartModel('inventorybyarea200', sections));
  //  this._data.push(new D3ChartModel('inventorybyarea201', sections));
  //  this._data.push(new D3ChartModel('inventorybyarea202', sections));
  //  this._data.push(new D3ChartModel('inventorybyarea204', sections));
  //  this._data.push(new D3ChartModel('inventorybyarea205', sections));


  //  values3 = [];
  //  values3.push(new ValuePair('fld1', 3));

  //  values4 = [];
  //  values4.push(new ValuePair('fld1', 40));

  //  sections = [];
  //  sections.push(new D3ChartSectionModel('top', '#ae34dd', '#dd34ea', values3));
  //  sections.push(new D3ChartSectionModel('btm', '#df23aa', '#aa32fd', values4));

  //  this._data.push(new D3ChartModel('inventorybyarea2', sections));

   

  //  values3 = [];
  //  values3.push(new ValuePair('fld1', 40));


  //  values4 = [];
  //  values4.push(new ValuePair('fld1', 20));

  //  sections = [];
  //  sections.push(new D3ChartSectionModel('top', '#ae34dd', '#dd34ea', values3));
  //  sections.push(new D3ChartSectionModel('btm', '#df23aa', '#aa32fd', values4));

  //  this._data.push(new D3ChartModel('inventorybyarea3', sections));
  //  sections = [];
  //  values3 = [];
  //  values3.push(new ValuePair('fld1', 50));


  //  values4 = [];
  //  values4.push(new ValuePair('fld1', 10));

  //  sections.push(new D3ChartSectionModel('top', '#ae34dd', '#dd34ea', values3));
  //  sections.push(new D3ChartSectionModel('btm', '#df23aa', '#aa32fd', values4));

  //  this._data.push(new D3ChartModel('inventorybyarea4', sections));
  //  sections = [];
  //  values3 = [];
  //  values3.push(new ValuePair('fld1', 55));


  //  values4 = [];
  //  values4.push(new ValuePair('fld1', 65));

  //  sections.push(new D3ChartSectionModel('top', '#ae34dd', '#dd34ea', values3));
  //  sections.push(new D3ChartSectionModel('btm', '#df23aa', '#aa32fd', values4));

  //  this._data.push(new D3ChartModel('inventorybyarea5', sections));
  //  this._data.push(new D3ChartModel('inventorybyarea52', sections));
  //  this._data.push(new D3ChartModel('inventorybyarea51', sections));
  //  this._data.push(new D3ChartModel('inventorybyarea21', sections));
  //  this._data.push(new D3ChartModel('inventorybyarea31', sections));
  //  this._data.push(new D3ChartModel('inventorybyarea41', sections));
  //  sections = [];
  //  values3 = [];
  //  values3.push(new ValuePair('fld1', 10));


  //  values4 = [];
  //  values4.push(new ValuePair('fld1', 50));

  //  sections.push(new D3ChartSectionModel('top', '#ae34dd', '#dd34ea', values3));
  //  sections.push(new D3ChartSectionModel('btm', '#df23aa', '#aa32fd', values4));

  //  this._data.push(new D3ChartModel('inventorybyarea6', sections));
  //  sections = [];
  //  values3 = [];
  //  values3.push(new ValuePair('fld1', 20));


  //  values4 = [];
  //  values4.push(new ValuePair('fld1', 10));

  //  sections.push(new D3ChartSectionModel('top', '#ae34dd', '#dd34ea', values3));
  //  sections.push(new D3ChartSectionModel('btm', '#df23aa', '#aa32fd', values4));

  //  this._data.push(new D3ChartModel('inventorybyarea7', sections));

  //  //sections.push(new D3ChartSectionModel('4', '#df23aa', '#aa32fd', 150, values4));
  //  //sections.push(new D3ChartSectionModel('5', '#df23aa', '#aa32fd', 150, values5));

  //}
}
