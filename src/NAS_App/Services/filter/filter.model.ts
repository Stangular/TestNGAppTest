import { Records } from '../../../dataManagement/model/records';
import { Field, BaseField } from '../../../dataManagement/model/field';
import { ElementModel, ElementFilter, FilterType, EditElementDefinition, IElementDefinition } from '../../../dataManagement/model/definitions/ElementDefinition';
import { D3AxisModel } from '../../../d3/axis/d3.axis.model';
//import { D3Service } from '../../../d3/services/d3.service';
import { Tick, IScale, Scale, NumericScale } from '../../../canvas/models/custom/layers/charts/axis/axis.layer';
import { StateIndex, UIStates } from '../../../canvas/models/DisplayValues';
import { ChartLayer } from '../../../canvas/models/custom/layers/charts/chart.layer';
import { BarLayer } from '../../../canvas/models/custom/layers/charts/content/bars/bar.layer';
import { Margin } from '../../../canvas/models/shapes/primitives/margin';
import { Size } from '../../../canvas/models/shapes/primitives/size';
import * as moment from 'moment';

export class FilterSystemInventoryModel extends Records<string> {

  axisModel: D3AxisModel;// = new D3AxisModel();

  constructor(
    private D3: any,
    formName: string
    , fields: Field<any>[] = []) {
    super(formName, 0, "sourceId" , fields);
  }

  public GetFormDefinition() {
    //if (this._UIElements.length <= 0) {
    //  //          let vals: IValidator[] = [];
    //  //        let nvals: IValidator[] = [];
    //  //let s= new ElementModel<string>();
    //  //s.formID = 'filterSystemInventoryForm';
    //  //s.fieldID = 'xdate';
    //  //s.type = 'date';
    //  //s.filter = new ElementFilter<string>('', FilterType.none);
    //  //this.addElement(new EditElementDefinition<string>(s, ''));
    //  //let m = new ElementModel<number>();
    //  //m.fieldID = 'xclose';
    //  //m.type = 'float';
    //  //m.filter = new ElementFilter<number>(0, FilterType.none);
    //  //this.addElement(new EditElementDefinition<number>(m, 1));
    //}
    return [];//this._UIElements;
  }

  UpdateDependentUI(): void {

  }

  GetUIValue(fieldID: string): any {
    return this._form.controls[fieldID].value;
  }

  New(data: any): Field<any> {
    return new BaseField(data);
  }

  SetDataView() {

   // this.axisModel = new D3AxisModel(this._fields);
  }

  OutputAll(): any {
    return {
      FormName: this.SourceID,
      RecordCount: 1,
      Content: this.testData
    };
  }

  get testData() {
    let fields: Field<string>[] = [];
    return fields;
  }

  ChartData(chartID: string): { xparam: number, yparam: number }[] {
    let data: { xparam: number, yparam: number }[] = [];
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
  ChartGraphic(chartID: string, width: number, height: number, chartName: string = ''): ChartLayer {
    return null;
  }

  ChartIDFrom(chartNumber: number) {
    return '';
  }

}


export class FilterCityTemperatureModel extends Records<string> {

 // axisModel: D3AxisModel;// = new D3AxisModel();

  constructor(
    private D3: any,
    formName: string
    , fields: Field<any>[] = []) {
    super(formName, 0, "sourceId", fields);
  }

  public GetFormDefinition() {
    //if (this._UIElements.length <= 0) {
    //  //          let vals: IValidator[] = [];
    //  //        let nvals: IValidator[] = [];
    // // let m = new ElementModel();
    // // m.formID = 'filterSystemInventoryForm';
    // // m.fieldID = 'date';
    // //this.addElement(new EditElementDefinition( m, ''));
    //  //this.addElement(new EditElementDefinition('filterSystemInventoryForm', 'new_york', true, 1, 1, 1, '', 'float'));
    //  //this.addElement(new EditElementDefinition('filterSystemInventoryForm', 'san_francisco', true, 1, 1, 1, '', 'float'));
    //  //this.addElement(new EditElementDefinition('filterSystemInventoryForm', 'austin', true, 1, 1, 1, '', 'float'));
    //}
    return []; //this._UIElements;
  }

  ChartData(chartID: string): { xparam: number, yparam: number }[] {
    let data: { xparam: number, yparam: number }[] = [];
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
  ChartGraphic(chartID: string, width: number, height: number, chartName: string = ''): ChartLayer {
    return null;
  }

  ChartIDFrom(chartNumber: number) {
    return '';
  }


  UpdateDependentUI(): void {

  }

  GetUIValue(fieldID: string): any {
    return this._form.controls[fieldID].value;
  }


  New(data: any): Field<any> {
    return new BaseField(data);
  }

  SetDataView() {

   //this.axisModel = new D3AxisModel(this._fields);
  }
  OutputAll(): any {
    return {
      FormName: this.SourceID,
      RecordCount: 1,
      Content: this.testData
    };
  }

  get testData() {
    let fields: Field<string>[] = [];
    return fields;
  }
}

export class FilterBarCharModel extends Records<string> {

  axisModel: D3AxisModel;// = new D3AxisModel();

  constructor(
    private D3: any,
    formName: string
    , fields: Field<any>[] = []) {
    super(formName, 0, "sourceId", fields);
  }

  public GetFormDefinition() {
    //if (this._UIElements.length <= 0) {
    //  //          let vals: IValidator[] = [];
    //  //        let nvals: IValidator[] = [];'
    //  let s = new ElementModel<string>();
    //  s.formID = 'filterSystemInventoryForm';
    //  s.fieldID = 'state';
    //  s.defaultValue = '';
    //  this.addElement(new EditElementDefinition<string>(s));
    //  let m = new ElementModel<number>();
    //  m = new ElementModel<number>(m);
    //  m.fieldID = 'under_5';
    //  m.type = 'number';
    //  this.addElement(new EditElementDefinition<number>(m));
    //  m = new ElementModel<number>(m);
    //  m.fieldID = 'to_13';
    //  this.addElement(new EditElementDefinition<number>(m));
    //  m = new ElementModel<number>(m);
    //  m.fieldID = 'to_17';
    //  this.addElement(new EditElementDefinition<number>(m));
    //  m = new ElementModel<number>(m);
    //  m.fieldID = 'to_24';
    //  this.addElement(new EditElementDefinition<number>(m));
    //  m = new ElementModel<number>(m);
    //  m.fieldID = 'to_44';
    //  this.addElement(new EditElementDefinition<number>(m));
    //  m = new ElementModel<number>(m);
    //  m.fieldID = 'to_64';
    //  this.addElement(new EditElementDefinition<number>(m));
    //  m = new ElementModel<number>(m);
    //  m.fieldID = 'over_64';
    //  this.addElement(new EditElementDefinition<number>(m));
    //}
    return []; //this._UIElements;
  }

  UpdateDependentUI(): void {

  }

  GetUIValue(fieldID: string): any {
    return this._form.controls[fieldID].value;
  }


  New(data: any): Field<any> {
    return new BaseField(data);
  }

  SetDataView() {

//    this.axisModel = new D3AxisModel(this._fields);
  }

  ChartData(chartID: string): { xparam: number, yparam: number }[] {
    let data: { xparam: number, yparam: number }[] = [];
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
  ChartGraphic(chartID: string, width: number, height: number, chartName: string = ''): ChartLayer {
    return null;

  }

  ChartIDFrom(chartNumber: number) {
    return '';
  }

  OutputAll(): any {
    return {
      FormName: this.SourceID,
      RecordCount: 1,
      Content: this.testData
    };
  }
  get testData() {

    let data: string[] = [];
   // let f = new BaseField({ ElementName: 'state', values: [] });
    data.push("AL, 310504, 552339, 259034, 450818, 1231572, 1215966, 641667");
    data.push("AK, 52083, 85640, 42153, 74257, 198724, 183159, 50277");
    data.push("AZ, 515910, 828669, 362642, 601943, 1804762, 1523681, 862573");
    data.push("AR, 202070, 343207, 157204, 264160, 754420, 727124, 407205");
    data.push("CA, 2704659, 4499890, 2159981, 3853788, 10604510, 8819342, 4114496");
    data.push("CO, 358280, 587154, 261701, 466194, 1464939, 1290094, 511094");
    data.push("CT, 211637, 403658, 196918, 325110, 916955, 968967, 478007");
    data.push("DE, 59319, 99496, 47414, 84464, 230183, 230528, 121688");
    data.push("DC, 36352, 50439, 25225, 75569, 193557, 140043, 70648");
    data.push("FL, 1140516, 1938695, 925060, 1607297, 4782119, 4746856, 3187797");
    data.push("GA, 740521, 1250460, 557860, 919876, 2846985, 2389018, 981024");
    data.push("HI, 87207, 134025, 64011, 124834, 356237, 331817, 190067");
    data.push("ID, 121746, 201192, 89702, 147606, 406247, 375173, 182150");
    data.push("IL, 894368, 1558919, 725973, 1311479, 3596343, 3239173, 1575308");
    data.push("IN, 443089, 780199, 361393, 605863, 1724528, 1647881, 813839");
    data.push("IA, 201321, 345409, 165883, 306398, 750505, 788485, 444554");
    data.push("KS, 202529, 342134, 155822, 293114, 728166, 713663, 366706");
    data.push("KY, 284601, 493536, 229927, 381394, 1179637, 1134283, 565867");
    data.push("LA, 310716, 542341, 254916, 471275, 1162463, 1128771, 540314");
    data.push("ME, 71459, 133656, 69752, 112682, 331809, 397911, 199187");
    data.push("MD, 371787, 651923, 316873, 543470, 1556225, 1513754, 679565");
    data.push("MA, 383568, 701752, 341713, 665879, 1782449, 1751508, 871098");
    data.push("MI, 625526, 1179503, 585169, 974480, 2628322, 2706100, 1304322");
    data.push("MN, 358471, 606802, 289371, 507289, 1416063, 1391878, 650519");
    data.push("MS, 220813, 371502, 174405, 305964, 764203, 730133, 371598");
    data.push("MO, 399450, 690476, 331543, 560463, 1569626, 1554812, 805235");
    data.push("MT, 61114, 106088, 53156, 95232, 236297, 278241, 137312");
    data.push("NE, 132092, 215265, 99638, 186657, 457177, 451756, 240847");
    data.push("NV, 199175, 325650, 142976, 212379, 769913, 653357, 296717");
    data.push("NH, 75297, 144235, 73826, 119114, 345109, 388250, 169978");
    data.push("NJ, 557421, 1011656, 478505, 769321, 2379649, 2335168, 1150941");
    data.push("NM, 148323, 241326, 112801, 203097, 517154, 501604, 260051");
    data.push("NY, 1208495, 2141490, 1058031, 1999120, 5355235, 5120254, 2607672");
    data.push("NC, 652823, 1097890, 492964, 883397, 2575603, 2380685, 1139052");
    data.push("ND, 41896, 67358, 33794, 82629, 154913, 166615, 94276");
    data.push("OH, 743750, 1340492, 646135, 1081734, 3019147, 3083815, 1570837");
    data.push("OK, 266547, 438926, 200562, 369916, 957085, 918688, 490637");
    data.push("OR, 243483, 424167, 199925, 338162, 1044056, 1036269, 503998");
    data.push("PA, 737462, 1345341, 679201, 1203944, 3157759, 3414001, 1910571");
    data.push("RI, 60934, 111408, 56198, 114502, 277779, 282321, 147646");
    data.push("SC, 303024, 517803, 245400, 438147, 1193112, 1186019, 596295");
    data.push("SD, 58566, 94438, 45305, 82869, 196738, 210178, 116100");
    data.push("TN, 416334, 725948, 336312, 550612, 1719433, 1646623, 819626");
    data.push("TX, 2027307, 3277946, 1420518, 2454721, 7017731, 5656528, 2472223");
    data.push("UT, 268916, 413034, 167685, 329585, 772024, 538978, 246202");
    data.push("VT, 32635, 62538, 33757, 61679, 155419, 188593, 86649");
    data.push("VA, 522672, 887525, 413004, 768475, 2203286, 2033550, 940577");
    data.push("WA, 433119, 750274, 357782, 610378, 1850983, 1762811, 783877");
    data.push("WV, 105435, 189649, 91074, 157989, 470749, 514505, 285067");
    data.push("WI, 362277, 640286, 311849, 553914, 1487457, 1522038, 750146");
    data.push("WY, 38253, 60890, 29314, 53980, 137338, 147279, 65614");

    let fields: Field<string>[] = [];
    let state: string[] = [];
    let under_5: string[] = [];
    let to_13: string[] = [];
    let to_17: string[] = [];
    let to_24: string[] = [];
    let to_44: string[] = [];
    let to_64: string[] = [];
    let over_64: string[] = [];


    data.forEach(function (d, i) {
      let parts = d.split(',');
      state.push(parts[0].trim());
      under_5.push(parts[1].trim());
      to_13.push(parts[2].trim());
      to_17.push(parts[3].trim());
      to_24.push(parts[4].trim());
      to_44.push(parts[5].trim());
      to_64.push(parts[6].trim());
      over_64.push(parts[7].trim());
    });

    //fields.push(new BaseField({ ElementName: 'state', values: state }));
    //fields.push(new BaseField({ ElementName: 'under_5', values: under_5 }));
    //fields.push(new BaseField({ ElementName: 'to_13', values: to_13 }));
    //fields.push(new BaseField({ ElementName: 'to_17', values: to_17 }));
    //fields.push(new BaseField({ ElementName: 'to_24', values: to_24 }));
    //fields.push(new BaseField({ ElementName: 'to_44', values: to_44 }));
    //fields.push(new BaseField({ ElementName: 'to_64', values: to_64 }));
    //fields.push(new BaseField({ ElementName: 'over_64', values: over_64 }));

    return fields;
    //  return data;
  }
}

export class FilterNormalizedStackedBarChartModel extends Records<string> {

  axisModel: D3AxisModel;// = new D3AxisModel();

  constructor(
    private D3: any,
    formName: string
    , fields: Field<any>[] = []) {
    super(formName,0,"", fields);
  }

  public GetFormDefinition(): IElementDefinition[] {
    //if (this._UIElements.length <= 0) {
    //  //          let vals: IValidator[] = [];
    //  //        let nvals: IValidator[] = [];'
    //  let s = new ElementModel<string>();
    //  s.formID = 'filterSystemInventoryForm';
    //  s.fieldID = 'state';
    //  s.defaultValue = '';
    //  this.addElement(new EditElementDefinition<string>(s));
    //  let m = new ElementModel<number>();
    //  m = new ElementModel<number>(m);
    //  m.fieldID = 'under_5';
    //  m.type = 'number';
    //  this.addElement(new EditElementDefinition<number>(m));
    //  m = new ElementModel<number>(m);
    //  m.fieldID = 'to_13';
    //  this.addElement(new EditElementDefinition<number>(m));
    //  m = new ElementModel<number>(m);
    //  m.fieldID = 'to_17';
    //  this.addElement(new EditElementDefinition<number>(m));
    //  m = new ElementModel<number>(m);
    //  m.fieldID = 'to_24';
    //  this.addElement(new EditElementDefinition<number>(m));
    //  m = new ElementModel<number>(m);
    //  m.fieldID = 'to_44';
    //  this.addElement(new EditElementDefinition<number>(m));
    //  m = new ElementModel<number>(m);
    //  m.fieldID = 'to_64';
    //  this.addElement(new EditElementDefinition<number>(m));
    //  m = new ElementModel<number>(m);
    //  m.fieldID = 'over_64';
    //  this.addElement(new EditElementDefinition<number>(m));
    //}
  return this._fields;
  }

  UpdateDependentUI(): void {

  }

  GetUIValue(fieldID: string): any {
    return this._form.controls[fieldID].value;
  }

  ChartData(chartID: string): { xparam: number, yparam: number }[] {
    let data: { xparam: number, yparam: number }[] = [];;
    //let fx = this.Fields.find(f => f.FieldId == 'date');
    //let fy = this.Fields.find(f => f.FieldId == 'income');
    //for (let i = 0; i < fx.Data.length; i++) {
    //  data.push({
    //    xparam: fx[0].Value(i),
    //    yparam: parseInt(fy[1].Value(i)),
    //  });
    //}
    return data;
  }
  ChartGraphic(chartID: string, width: number, height: number, chartName: string = ''): ChartLayer {
    return null;
  }

  ChartIDFrom(chartNumber: number) {
    return '';
  }

  New(data: any): Field<any> {
    return new BaseField(data);
  }

  SetDataView() {

   // this.axisModel = new D3AxisModel(this._fields);
  }
  OutputAll(): any {
    return {
      FormName: this.SourceID,
      RecordCount: 1,
      Content: this.testData
    };
  }
  get testData() {

    let data: string[] = [];
  //  let f = new BaseField({ fieldID: 'state', values: [] });
    data.push("AL, 310504, 552339, 259034, 450818, 1231572, 1215966, 641667");
    data.push("AK, 52083, 85640, 42153, 74257, 198724, 183159, 50277");
    data.push("AZ, 515910, 828669, 362642, 601943, 1804762, 1523681, 862573");
    data.push("AR, 202070, 343207, 157204, 264160, 754420, 727124, 407205");
    data.push("CA, 2704659, 4499890, 2159981, 3853788, 10604510, 8819342, 4114496");
    data.push("CO, 358280, 587154, 261701, 466194, 1464939, 1290094, 511094");
    data.push("CT, 211637, 403658, 196918, 325110, 916955, 968967, 478007");
    data.push("DE, 59319, 99496, 47414, 84464, 230183, 230528, 121688");
    data.push("DC, 36352, 50439, 25225, 75569, 193557, 140043, 70648");
    data.push("FL, 1140516, 1938695, 925060, 1607297, 4782119, 4746856, 3187797");
    data.push("GA, 740521, 1250460, 557860, 919876, 2846985, 2389018, 981024");
    data.push("HI, 87207, 134025, 64011, 124834, 356237, 331817, 190067");
    data.push("ID, 121746, 201192, 89702, 147606, 406247, 375173, 182150");
    data.push("IL, 894368, 1558919, 725973, 1311479, 3596343, 3239173, 1575308");
    data.push("IN, 443089, 780199, 361393, 605863, 1724528, 1647881, 813839");
    data.push("IA, 201321, 345409, 165883, 306398, 750505, 788485, 444554");
    data.push("KS, 202529, 342134, 155822, 293114, 728166, 713663, 366706");
    data.push("KY, 284601, 493536, 229927, 381394, 1179637, 1134283, 565867");
    data.push("LA, 310716, 542341, 254916, 471275, 1162463, 1128771, 540314");
    data.push("ME, 71459, 133656, 69752, 112682, 331809, 397911, 199187");
    data.push("MD, 371787, 651923, 316873, 543470, 1556225, 1513754, 679565");
    data.push("MA, 383568, 701752, 341713, 665879, 1782449, 1751508, 871098");
    data.push("MI, 625526, 1179503, 585169, 974480, 2628322, 2706100, 1304322");
    data.push("MN, 358471, 606802, 289371, 507289, 1416063, 1391878, 650519");
    data.push("MS, 220813, 371502, 174405, 305964, 764203, 730133, 371598");
    data.push("MO, 399450, 690476, 331543, 560463, 1569626, 1554812, 805235");
    data.push("MT, 61114, 106088, 53156, 95232, 236297, 278241, 137312");
    data.push("NE, 132092, 215265, 99638, 186657, 457177, 451756, 240847");
    data.push("NV, 199175, 325650, 142976, 212379, 769913, 653357, 296717");
    data.push("NH, 75297, 144235, 73826, 119114, 345109, 388250, 169978");
    data.push("NJ, 557421, 1011656, 478505, 769321, 2379649, 2335168, 1150941");
    data.push("NM, 148323, 241326, 112801, 203097, 517154, 501604, 260051");
    data.push("NY, 1208495, 2141490, 1058031, 1999120, 5355235, 5120254, 2607672");
    data.push("NC, 652823, 1097890, 492964, 883397, 2575603, 2380685, 1139052");
    data.push("ND, 41896, 67358, 33794, 82629, 154913, 166615, 94276");
    data.push("OH, 743750, 1340492, 646135, 1081734, 3019147, 3083815, 1570837");
    data.push("OK, 266547, 438926, 200562, 369916, 957085, 918688, 490637");
    data.push("OR, 243483, 424167, 199925, 338162, 1044056, 1036269, 503998");
    data.push("PA, 737462, 1345341, 679201, 1203944, 3157759, 3414001, 1910571");
    data.push("RI, 60934, 111408, 56198, 114502, 277779, 282321, 147646");
    data.push("SC, 303024, 517803, 245400, 438147, 1193112, 1186019, 596295");
    data.push("SD, 58566, 94438, 45305, 82869, 196738, 210178, 116100");
    data.push("TN, 416334, 725948, 336312, 550612, 1719433, 1646623, 819626");
    data.push("TX, 2027307, 3277946, 1420518, 2454721, 7017731, 5656528, 2472223");
    data.push("UT, 268916, 413034, 167685, 329585, 772024, 538978, 246202");
    data.push("VT, 32635, 62538, 33757, 61679, 155419, 188593, 86649");
    data.push("VA, 522672, 887525, 413004, 768475, 2203286, 2033550, 940577");
    data.push("WA, 433119, 750274, 357782, 610378, 1850983, 1762811, 783877");
    data.push("WV, 105435, 189649, 91074, 157989, 470749, 514505, 285067");
    data.push("WI, 362277, 640286, 311849, 553914, 1487457, 1522038, 750146");
    data.push("WY, 38253, 60890, 29314, 53980, 137338, 147279, 65614");

    let fields: Field<string>[] = [];
    let state: string[] = [];
    let under_5: string[] = [];
    let to_13: string[] = [];
    let to_17: string[] = [];
    let to_24: string[] = [];
    let to_44: string[] = [];
    let to_64: string[] = [];
    let over_64: string[] = [];


    data.forEach(function (d, i) {
      let parts = d.split(',');
      state.push(parts[0].trim());
      under_5.push(parts[1].trim());
      to_13.push(parts[2].trim());
      to_17.push(parts[3].trim());
      to_24.push(parts[4].trim());
      to_44.push(parts[5].trim());
      to_64.push(parts[6].trim());
      over_64.push(parts[7].trim());
    });

    //fields.push(new BaseField({ fieldID: 'state', values: state }));
    //fields.push(new BaseField({ fieldID: 'under_5', values: under_5 }));
    //fields.push(new BaseField({ fieldID: 'to_13', values: to_13 }));
    //fields.push(new BaseField({ fieldID: 'to_17', values: to_17 }));
    //fields.push(new BaseField({ fieldID: 'to_24', values: to_24 }));
    //fields.push(new BaseField({ fieldID: 'to_44', values: to_44 }));
    //fields.push(new BaseField({ fieldID: 'to_64', values: to_64 }));
    //fields.push(new BaseField({ fieldID: 'over_64', values: over_64 }));

    return fields;
    //  return data;
  }
}

export class BarChartModel{

  private staticValue: Number = 0;
  private variableValue: Number = 0;

  constructor(
    private income: number,
    private date: Date) { }


  CalculateVariablePosition( pos: Number, variableExtent:number, maxValue: number ) {
    return ((this.income / maxValue) * variableExtent);
  }
}

export class FilterBasicBarChartModel extends Records<string> {

  axisModel: D3AxisModel;// = new D3AxisModel();
  
  constructor(

    formName: string
    , fields: Field<any>[] = []) {
    super(formName, 0,"", fields);
  }

 public GetFormDefinition() {
  //  if (this._UIElements.length <= 0) {
  //    //          let vals: IValidator[] = [];
  //    //        let nvals: IValidator[] = [];'

  //    let s = new ElementModel<string>();
  //    s.formID = 'filterBasicBarForm';
  //    s.fieldID = 'id';
  //    s.label = ':';
  //    s.defaultValue = "";
  //    s.autoDirtyOnDefault = true;
  //    this.addElement(new EditElementDefinition<string>(s));

  //    s = new ElementModel<string>();
  //    s.formID = 'filterBasicBarForm';
  //    s.fieldID = 'date';
  //    s.label = 'Date';
  //    s.defaultValue = '';
  //    s.type = 'date';
  //    const date = new Date();
  //    const year = date.getFullYear();
  //    const month = date.getMonth() + 1;
  //    const day = 1;

  //    s.defaultValue = year + '-' + month + '-0' + day;

  //    this.addElement(new EditElementDefinition<string>(s));
  //    let m = new ElementModel<number>();
  //    m = new ElementModel<number>(m);
  //    m.formID = 'filterBasicBarForm';
  //    m.fieldID = 'income';
  //    m.label = 'Income';
  //    m.type = 'number';
  //    m.defaultValue = 0;
  //    this.addElement(new EditElementDefinition<number>(m));
   //  }
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

  ValueToDateGraphic(width: number, height: number, chartName: string = '') {
    //let f = this.Fields.find(f => f.FieldId == 'Id');//
    //let fid = f.Data;

    //let fx = this.Fields.find(f => f.FieldId == 'date').Data;
    //// Chart has its own order...
    //let fxx = fx.map(d => d)
    //fxx.sort(function (a, b) {
    //  let mb = moment(b);
    //  let ma = moment(a);
    //  return (mb > ma ? -1 : 1);
    //});
    //let fy = this.Fields.find(f => f.FieldId == 'income');

    //if (!fx || !fy) {
    //  return null;
    //}
    //let d: string = '';
    //let r: string[] = [];
    //let years: { label: string, id: string }[] = [];
    //let months: { label: string, id: string }[] = [];

    //for (let i = 0; i < fx.length; i++) {
    //  d = fx[i];
    //  // calculate percentage of total height -  x/H = (d/500)* H 
    //}

    //for (let i = 0; i < fxx.length; i++) {
    //  d = fxx[i];
    //  r = d.split('-')
    //  let ndx = fx.findIndex(f => f == d);
    //  years.push({ label: years.findIndex(y => y.label == r[0]) >= 0 ? '' : r[0], id: fid[ndx] });
    //  months.push({ label: r[1], id: fid[ndx] });
    //}
    //let dateScale: any[] = [];
    //dateScale.push({ scale: new Scale(months), width: 20, height: 16, angle: 0 });
    //dateScale.push({ scale: new Scale(years), width: 20, height: 16, angle: 0 });
    //let xTick = new Tick(dateScale, 5, 0, 50);

    //let xScale = new NumericScale(0, 2000, 50, 100);

    //let scale1 = { scale: xScale, width: 20, height: 16, angle: 0 };

    //let yTick = new Tick([scale1], 5, 0, 50);
    //let chartstate: StateIndex;

    //chartstate = new StateIndex('barchart');
    //chartstate.setState(UIStates.background, 5);
    //chartstate.setState(UIStates.foreground, 3);
    //chartstate.setState(UIStates.color, 3);
    //chartstate.setState(UIStates.weight, 0);
    //chartstate.setState(UIStates.fontFace, 0);
    //let margins = new Margin(10, 50, 10, 60);
    //let chart: ChartLayer;

    //let bar = new BarLayer(0, 2000, fid, fy.Data, margins, new Size(width, height));
    //chart = new ChartLayer(
    //  width, height,
    //  margins, xTick, yTick, 'barchart', 'bc1',
    //  chartstate, bar);
    //return chart;
  }

  ChartGraphic(chartID: string, width: number, height: number, chartName: string = ''): ChartLayer {
    let chart: ChartLayer;
    //switch (chartID) {
    //  case 'chart2': chart = this.ValueToDateGraphic(width, height, chartName); break;
    //  default: chart = null; break;
    //}
    return chart;
  }

  SetDataView() {

  //  this.axisModel = new D3AxisModel(this._fields);
  }

  get NewContent() {
    //let flds: string[] = [];
    //this._fields.find(f =>)

    //this.New.forEach(function (f, i) {
    //   this._fields.find(f =>)
    //});
    return this._fields;
  }

  OutputAll(): any{
    return {
      FormName: this.SourceID,
      RecordCount: 14,
      Content: this.testData
    };
  }

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
