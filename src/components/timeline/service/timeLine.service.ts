import { Injectable } from '@angular/core';
import { EventContextLayer, IDataResult } from 'src/canvas/models/IContextItem';
import { Rectangle } from 'src/canvas/models/shapes/rectangle';
import { TimeLineRange, RangeCatalog } from './timeLine.model';
import { AreaSizer } from 'src/canvas/models/shapes/sizing/sizer';
import { TimeLineDataResult } from 'src/canvas/models/concepts/timelines/timeLineBase.model';

@Injectable()
export class TimeLineService {

  private _data: IDataResult = new TimeLineDataResult();
  public _dateChanged: boolean = false;
  public _dataChanged: any = false;

  private _dateRange: Date[] = [];

  constructor() {

    let d = new Date();

    this._dateRange.push(d);
    this._dateRange.push(new Date(d));
    this._dateRange.push(new Date(d));



    let d1 = new Date(1781, 4, 25, 12, 0, 0, 0);
    let d2 = new Date(1781, 6, 24, 12, 0, 0, 0);
    let tlr: TimeLineRange = new TimeLineRange("", "LoyalistsA", "", d1, d2);
    RangeCatalog.AddTimeRange(tlr);

    d1 = new Date(1781, 2, 24, 12, 0, 0, 0);
    d2 = new Date(1781, 4, 24, 12, 0, 0, 0);
    tlr = new TimeLineRange("", "LoyalistsB", "", d1, d2);
    RangeCatalog.AddTimeRange(tlr);

    d1 = new Date(1782, 12, 25, 12, 0, 0, 0);
    d2 = new Date(1783, 2, 24, 12, 0, 0, 0);
    tlr = new TimeLineRange("", "LoyalistsC", "POW with rebels", d1, d2);
    RangeCatalog.AddTimeRange(tlr);

    d1 = new Date(1782, 4, 25, 12, 0, 0, 0);
    d2 = new Date(1782, 6, 24, 12, 0, 0, 0);
    tlr = new TimeLineRange("", "LoyalistsD", "On the frontier in Georgia", d1, d2);
    RangeCatalog.AddTimeRange(tlr);

    d1 = new Date(1779, 1, 1, 12, 0, 0, 0);
    d2 = new Date(1779, 12, 30, 12, 0, 0, 0);
    tlr = new TimeLineRange("", "PatriotA", "Served in 3rd Regiment, SC sometime in 1779", d1, d2);
    RangeCatalog.AddTimeRange(tlr);

    d1 = new Date(1780, 1, 11, 12, 0, 0, 0);
    d2 = new Date(1781, 7, 28, 12, 0, 0, 0);
    tlr = new TimeLineRange("", "PatriotB", "Under Col. Hopkins", d1, d2);
    RangeCatalog.AddTimeRange(tlr);

    d1 = new Date(1781, 1, 8, 13, 0, 0, 0);
    d2 = new Date(1783, 12, 7, 12, 0, 0, 0);
    tlr = new TimeLineRange("", "PatriotC", "Under Col. Hopkins", d1, d2);
    RangeCatalog.AddTimeRange(tlr);

  

    //this._date.Update(new Date(1844, 5, 15, 0, 0, 0, 0));
  }

  get Data() {
    return this._data;
  }
  GetContextLayer(parentArea: Rectangle, id: string): EventContextLayer {
    let result: EventContextLayer = null;
    //switch (id.toLowerCase()) {
    //  case 'timeline-decade': result = new TimeLineBaseLayerModel(parentArea, new Date(), 12, 80, 0, TimeLineTypes.decade); break;
    //  case 'timeline-century': result = new TimeLineBaseLayerModel(parentArea, new Date(), 12, 80, 0, TimeLineTypes.century); break;
    //  default: result = new TimeLineBaseLayerModel(parentArea, new Date(), 12, 80, 0, TimeLineTypes.month);
    //}



    return result;
  }

  ResetDateData(data: any) {
    this._data.Data[0] = data[0];
    this._data.Data[1] = data[1];
    this._data.Data[2] = data[2];
  }
  get LeftDate() : Date {
    return this._data.Data[0] as Date;
  }

  get RightDate(): Date {
    return this._data.Data[1] as Date;
  }

  get SliderDate(): Date {
    return this._data.Data[2] as Date;
  }

  public SetDateRange(date1: Date, date2: Date) {
    if (date1 && date2) {
      this.LeftDate.setDate(date1.getDate());
      this._dateRange[1].setDate(date1.getDate());
    }
  }


  public GetDateRange(): Date[] {
    return this._dateRange;
  }

  private dateAsString(d: Date): string {
    let m = d.getMonth() + 1;
    return m + '/' + d.getDate() + '/' + d.getFullYear();
  }

  public GetDateRangeString(): string[] {
    const range: string[] = [];
    range.push(this.dateAsString(this.LeftDate));
    range.push(this.dateAsString(this._dateRange[1]));
    return range;
  }

  SetTimeLineRangeFirstYear(value: number) {
    this.LeftDate.setFullYear(value);
  }

  SetTimeLineRangeFirstMonth(value: number) {
    this.LeftDate.setMonth(value);
    this._dataChanged = !this._dataChanged;
  }

  SetTimeLineRangeFirstDay(value: number) {

    this.LeftDate.setDate(value);
    this._dataChanged = !this._dataChanged;
  }

  SetTimeLineRangeFinalYear(value: number) {
    this.RightDate.setFullYear(value);
  }

  SetTimeLineRangeFinalMonth(value: number) {
    this.RightDate.setMonth(value - 1);
    this._dataChanged = !this._dataChanged;
  }

  SetTimeLineRangeFinalDay(value: number) {
    this.RightDate.setDate(value);
    this._dataChanged = !this._dataChanged;
  }

  get timeLineRangeFirstYear(): string {
    return this.LeftDate.getFullYear().toString();
  }

  get timeLineRangeFirstMonth(): string {
    const m = this.LeftDate.getMonth() + 1;
    return m.toString();
  }

  get timeLineRangeFirstDay(): string {
    return this.LeftDate.getDate().toString();
  }

  get timeLineRangeFinalYear(): string {
    return this.RightDate.getFullYear().toString();
  }

  get timeLineRangeFinalMonth(): string {
    const m = this.RightDate.getMonth() + 1;
    return m.toString();
  }

  get timeLineRangeFinalDay(): string {
    return this.RightDate.getDate().toString();
  }

  get DateChange() {
    return this.SliderDate;
  }

  ChangeDate(year: number, month: number, day: number) {
    this._data.Data[2] = new Date(year, month, day, 0, 0, 0, 0);
    this._dataChanged = !this._dataChanged;
  }

  get timeLineDateYear(): string {
    return this.SliderDate.getFullYear().toString();
  }

  get timeLineDateMonth(): string {
    const m = this.SliderDate.getMonth() + 1;
    return m.toString();
  }

  get timeLineDateDay(): string {
    return this.SliderDate.getDate().toString();
  }

  get TimeLineDate(): Date {
    if (!this.SliderDate) {
      let sss = 0;
    }
    return this.SliderDate;
  }
}
