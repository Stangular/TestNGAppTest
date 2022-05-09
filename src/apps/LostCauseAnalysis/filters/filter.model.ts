import { Records } from '../../../dataManagement/model/records';
import { Field, BaseField } from '../../../dataManagement/model/field';
import { ElementModel, ElementFilter, EditElementDefinition, IElementDefinition, ElementModelFactory, ModelType } from '../../../dataManagement/model/definitions/ElementDefinition';
import { D3AxisModel } from '../../../d3/axis/d3.axis.model';
import { ChartLayer } from '../../../canvas/models/custom/layers/charts/chart.layer';

export class FilterLostCausePeopleModel extends Records<string> {


  constructor(
    formName: string
    , formId
    , fields: Field<any>[] = []) {
    super(formName, formId, "Person", fields);

  }

  public AddFieldFromModel(models: ElementModelFactory) {
    this.Fields.push(new BaseField(models.TextModel.GetElementDefinition('Surname', 1001, ModelType.Text, 'Surname', true), 'Surname'));
    this.Fields.push(new BaseField(models.TextModel.GetElementDefinition('GivenName', 1002, ModelType.Text, 'Given Name', true), 'GivenName'));
    this.Fields.push(new BaseField(models.IntegerModel.GetElementDefinition('YOB', 1003, ModelType.Int, 'YOB', true), 'YOB'));
    this.Fields.push(new BaseField(models.IntegerModel.GetElementDefinition('Wealth', 1004, ModelType.Int, 'Wealth', true), 'Wealth'));
    this.Fields.push(new BaseField(models.TextModel.GetElementDefinition('Occupation', 1005, ModelType.Text, 'Occupation', true), 'Occupation'));
    this.Fields.push(new BaseField(models.BooleanModel.GetElementDefinition('Literate', 1006, ModelType.Bool, 'Literate', true), 'Literate'));
    this.Fields.push(new BaseField(models.TextModel.GetElementDefinition('Wife', 1007, ModelType.Text, 'Wife', true), 'Wife'));
    this.Fields.push(new BaseField(models.IntegerModel.GetElementDefinition('Wife_YOB', 1008, ModelType.Int, 'Wife_YOB', true), 'Wife_YOB'));
    this.Fields.push(new BaseField(new EditElementDefinition('Id', 2000, 0, '', null, null, false, false), 'Id'));
    this.Fields.push(new BaseField(new EditElementDefinition('stateId', 2001, 0, '', null, null, false, false), 'stateId'));
 }


  public GetFormDefinition() {
 

    let s = new ElementModel();
  
    return this._fields;
  }

  UpdateDependentUI(): void {

  }

  GetUIValue(fieldID: string): any {
    const c = this._form.controls[fieldID];
    if (c) {
      return c.value;
    }
    return '';
  }

  New(data: any): Field<any> {
    return new BaseField(data);
  }

  ChartData(chartID: string): { xparam: number, yparam: number }[] {
    let data: { xparam: number, yparam: number }[] = [];
  
    return data;
  }

  ChartIDFrom(chartNumber: number) {

  }

  ValueToDateGraphic(width: number, height: number, chartName: string = '') {
   
  }

  ChartGraphic(chartID: string, width: number, height: number, chartName: string = ''): ChartLayer {
    let chart: ChartLayer;
    return chart;
  }

  SetDataView() {

  }

  get NewContent() {
 
    return this._fields;
  }

  OutputAll(): any {
    return {
      FormName: this.SourceID,
      RecordCount: 14,
      Content: []
    };
  }
  
  
}

export class FilterLostCauseStateModel extends Records<string> {


  constructor(

    formName: string
    , formId
    , fields: Field<any>[] = []) {
    super(formName, formId, "State", fields);

  }

  public AddFieldFromModel(models: ElementModelFactory) {
    this.Fields.push(new BaseField(models.TextModel.GetElementDefinition('Name', 1001, ModelType.Text, 'Name', true), 'Name'));
    this.Fields.push(new BaseField(models.TextModel.GetElementDefinition('AKA', 1002, ModelType.Text, 'AKA', true), 'AKA'));
    this.Fields.push(new BaseField(models.BooleanModel.GetElementDefinition('Slave', 1003, ModelType.Bool, 'Slave State', true), 'Slave'));
    this.Fields.push(new BaseField(new EditElementDefinition('Id', 2000, 0, '', null, null, false, false), 'Id'));
  }


  public GetFormDefinition() {


    let s = new ElementModel();

    return this._fields;
  }

  UpdateDependentUI(): void {

  }

  GetUIValue(fieldID: string): any {
    const c = this._form.controls[fieldID];
    if (c) {
      return c.value;
    }
    return '';
  }

  New(data: any): Field<any> {
    return new BaseField(data);
  }

  ChartData(chartID: string): { xparam: number, yparam: number }[] {
    let data: { xparam: number, yparam: number }[] = [];

    return data;
  }

  ChartIDFrom(chartNumber: number) {

  }

  ValueToDateGraphic(width: number, height: number, chartName: string = '') {

  }

  ChartGraphic(chartID: string, width: number, height: number, chartName: string = ''): ChartLayer {
    let chart: ChartLayer;
    return chart;
  }

  SetDataView() {

  }

  get NewContent() {

    return this._fields;
  }

  OutputAll(): any {
    return {
      FormName: this.SourceID,
      RecordCount: 14,
      Content: []
    };
  }


}
