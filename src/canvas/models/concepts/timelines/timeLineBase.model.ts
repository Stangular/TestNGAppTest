import { Rectangle } from "../../shapes/rectangle";
import { IShape } from "../../shapes/IShape";
import { ContextLayer, ActionLayer, EventContextLayer, MousePosition, ITracker, IDataResult } from "../../IContextItem";
import { DisplayValues } from "../../DisplayValues";
import { lineTypes } from "../../lines/line";
import { Ellipse } from "../../shapes/ellipse";
import { Port } from "../../shapes/port";
import { Point } from "../../shapes/primitives/point";
import { IActionItem, ActionItemsss } from "src/canvas/component/layers/Interfaces/IActionLayer";
import { Action } from "rxjs/internal/scheduler/Action";
import { TextContent } from "../../shapes/content/Content";
import { Text } from "@angular/compiler";
//import { TextShape } from "../../shapes/content/text/text";
import { ITimeLine, TimeLineByYearModelH, TimeByDecadeModelH, TimeByCenturyModelH, YearContent, TimeMonthModel, TimeLine, TimeLineSlider, DateRange } from "src/components/timeline/service/timeLine.model";
import { ContextModel } from "src/canvas/component/context.model";
import { TimeLineSpanLayerModel } from "./timeLineSpan.model";
import { Shape, ShapeContainer } from "../../shapes/shape";
import { TimeLineService } from "src/components/timeline/service/timeLine.service";
import { AreaSizer } from "../../shapes/sizing/sizer";

export enum TimeLineTypes {
  year = 0,
  decade = 1,
  century = 2,
  month = 3,
  day = 4,
  hour = 5,
  minute = 6
}

export class TimeLineDataResult implements IDataResult {


  constructor(private dateRange: Date[] = []) {
    let d = new Date();

    this.dateRange.push(new Date(d));
    this.dateRange.push(new Date(d));
    this.dateRange.push(new Date(d));
  }

  public get ID() { return "timelinedata";}
  private setDate(offset: number, date: Date) {
    this.dateRange[offset].setFullYear(date.getFullYear());
    this.dateRange[offset].setMonth(date.getMonth());
    this.dateRange[offset].setDate(date.getDate());
  }

  public Update(data: any) {
    for (let i = 0; i < 3; i++) {
      this.setDate(i, data[i] as Date);
    }
  }

  get Data(): any {
    return this.dateRange;
  }

  get Flag(): any {
    return 1;
  }


}


export class TimeLineBaseLayerModel extends EventContextLayer {

  
  dateRange: TimeLineDataResult = new TimeLineDataResult();

  constructor(
    parentArea: Rectangle,
    private _endDate: Date, // date to count back from
    private _span: number, // number of units to include
    private _size: number, // size of time line unit?   level: time part counting from...
    private _level: number,
    private _timeLineType: TimeLineTypes = TimeLineTypes.year,
    protected _date: Date = new Date) {

    super(
      parentArea,
      'timeline'
      , 'timeline'
      , 'sss'
      , new Date()
      , '');

    //DisplayValues.SetColor('TimeSpansss', '#aad8e650');
    //DisplayValues.SetColor('TimeSpanLine', 'blue');
    //DisplayValues.SetWeight('TimeSpanLine', 2);

    this.ResetTimeLine(this.ParentArea, this._timeLineType);
    super.Init();
  }
  
  GetTouchedShape(point: Point): IShape {
    if (this.Content.length > 1 && (<IShape>this.Content[1]).IsPointInShape(point)) {
      return (<IShape>this.Content[1]);
    }
    return null;
  }

  ReturnTouchedShape(shape: IShape) {
    if (this.Content.length == 1) {
      this.Content.push(shape);
    }
  }

  ResetTimeLine(parentArea: Rectangle, timeLineType: TimeLineTypes = TimeLineTypes.year): void {
    this.ClearContent();
    //    this.AddContent(new TimeLineSlider("year", 0, 100, 80, 300));
    switch (timeLineType) {
      case TimeLineTypes.century:
        this.AddContent(new TimeByCenturyModelH('timeline1', 0, 0, parentArea.Width, 30, 'boundingArea', this._date.getFullYear(), 100));
        break;
      case TimeLineTypes.decade:
        this.AddContent(new TimeByDecadeModelH('timeline1', 0, 0, parentArea.Width, 30, 'boundingArea', this._date.getFullYear(), 100));
        break;
      case TimeLineTypes.month:
        this.AddContent(new TimeMonthModel('timeline_month', 40, 0, parentArea.Width, 16, 'boundingArea', 100));
        this.AddContent(new TimeLineSlider('timelineSpan_timeline_span', 40, 100, 80, 16));
        break;
      default:
        let timeLine = new TimeLineByYearModelH('timeline_year', 0, 0, parentArea.Width, 16, 'boundingArea', this._date.getFullYear(), 100);
        let offset = timeLine.ConvertDateToTimeOffset(this._date) - 50;
        let slider = new TimeLineSlider('timeline_span', 0, offset, 80, 16);

        this.AddContent(slider);
        this.AddContent(timeLine);

    }
    this._timeLineType = timeLineType;

  }

  get TimeLineType() { return this._timeLineType; }

  resetTimeLine() {
    //this.Content[0]
  }

  LoadCanvasData(inputData: any): Promise<any> { return null; }
  UpdateCanvasData(inputData: any) { }

  GetContextData(): any {
    return null;
  }

  AutoUpdate(): boolean {
    let d = 0;
    if (this.theSlider.Left < 0) {
      d = 1;
    }
    else if (this.theSlider.Right > this.theTimeLine.Right) {
      d = -1
    }
    else {
      return false;
    }
    this.theTimeLine.MoveBy(d, 0);
    this.setDateRange();
    return true;
  }

  ReturnMember(member: IShape) {
    if (member) {
      console.error("Returned Shape: " + member.Id);

    }
    else {
      this._mousePosition.Init
      let sss = 0;
      console.error("Returned Shape is null");
    }
    this.AddContent(member);
  }
  
  mouseMove(event: any, context: CanvasRenderingContext2D): void {

    super.mouseMove(event, context);
    this.setDateRange();

  }

  GetDataResult(): IDataResult {
    return this.dateRange;
  }
  
  //GetDateResult(): IDataResult {
  //  return this;
  //}

  SetDate(date:Date) {
    
    this.theTimeLine.InitToDate(date);

    let t = date.getTime();
    let d1 = this.dateRange.Data[0] as Date;
    let d2 = this.dateRange.Data[1] as Date;
    let t1 = d1.getTime();
    let t2 = d2.getTime();
    let d = (t2 - t1) / 2;
    t1 = t - d;
    t2 = t + d;
    d1.setTime(t1);
    d2.setTime(t2);
    let offset1 = this.theTimeLine.ConvertDateToTimeOffset(d1);
    let offset2 = this.theTimeLine.ConvertDateToTimeOffset(d2);
    this.theSlider.UpdatePosition(offset1, offset2);
    this._date = date;
  }

  SetDataResult(data: IDataResult, changeType: any) {
    let d = data as TimeLineDataResult;
    if (changeType == 2) {
      this.SetDate(d.Data[2] as Date);
      return;
    }

 
    let d1 = d.Data[0] as Date;
    let d2 = d.Data[1] as Date;
    let offset1 = this.theTimeLine.ConvertDateToTimeOffset(d1);
    let offset2 = this.theTimeLine.ConvertDateToTimeOffset(d2);
    
    if (this.theSlider.UpdatePosition(offset1, offset2)) {
      this.dateRange = d;

      offset2 -= offset1
      offset2 /= 2;
      offset2 += d1.getTime();
      this._date.setTime(offset2);

    }
  }

  private get theTimeLine(): TimeLine {
    return this.Content.find(c => c.Id == "timeline_year") as TimeLine;
  }

  private get theSlider(): TimeLineSlider {
    return this.Content.find(c => c.Id == "timeline_span") as TimeLineSlider;
  }

  private setDateRange() {
    this.theTimeLine.CalculatDataFromTimeSpan(this.theSlider, this.dateRange);
  }



  //Draw(context: CanvasRenderingContext2D, initial: boolean = false) {
  //  super.Draw(context, false);
  //  this._selectedItem.Draw(context);
  //  //if (initial) {
  //  //  this.theSlider.Draw(context);
  //  //  this._sizeAbleArea.Draw(context);
  //  //}
  //}

  get ContentModel(): TimeLine {
    return this.Content[0] as TimeLine;
  }

  GetSelectedShape(point: Point): IShape {

    if (this.Content.length > 1 && (<TimeLineSlider>this.Content[1]).IsPointInShape(point)) {
      let item = this.Content.splice(1, 1);
      return item[0] as TimeLineSlider;
    }
    if ((<TimeLine>this.Content[0]).IsPointInShape(point)) {
      return this.Content[0] as TimeLine;
    }
    return null;
  }

}
