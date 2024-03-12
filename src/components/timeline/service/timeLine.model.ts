import { extend } from "webdriver-js-extender";
import { Rectangle, GradientRectangle } from "src/canvas/models/shapes/rectangle";
import { IDataResult } from "src/canvas/models/IContextItem";
import { Point } from "src/canvas/models/shapes/primitives/point";
import { DisplayValues, StateIndex } from "src/canvas/models/DisplayValues";
import { TextContent, IDynamicContent, Content } from "src/canvas/models/shapes/content/Content";
//import { TextShape } from "src/canvas/models/shapes/content/text/text";
import { ActionItemsss, IActionItem, IMouseState } from "src/canvas/component/layers/Interfaces/IActionLayer";
import { forEach } from "@angular/router/src/utils/collection";
import { IShape, FreedomOfMotion } from "src/canvas/models/shapes/IShape";
//import { ContentShape } from "src/canvas/models/shapes/content/ContentShape";
import { Shape, ShapeContainer, ISizeableArea } from "src/canvas/models/shapes/shape";
import { Line } from "src/canvas/models/lines/line";
import { TimeLineDataResult } from "src/canvas/models/concepts/timelines/timeLineBase.model";
import { SizeableArea, AreaSizer } from "src/canvas/models/shapes/sizing/sizer";

export class DateRange {
  constructor(private first: Date = new Date(), private final: Date = null) {
    if (!final) {
      this.final = new Date(this.first);
    }
  }

  get First() {
    return this.first;
  }

  get Final() {
    return this.final;
  }

}

export class YearContent extends TextContent {


  constructor(Id: string,
    stateName: string,
    private year: number,
    fromSource: boolean = false,
    angle: number = 0) {
    super(Id,
      stateName,
      "",
      year.toString(),
      fromSource,
      angle);

  }

  get Year() { return this.year; }

  Update(content: number) {
    this.year += content;
    this.content = this.year.toString();
  }
}

export class MonthContent extends TextContent {


  constructor(Id: string,
    stateName: string,
    private month: number,
    fromSource: boolean = false,
    angle: number = 0) {
    super(Id,
      stateName,
      "",
      month.toString(),
      fromSource,
      angle);
    this.Update(month);
  }

  Update(content: number) {
    //this.month += content;
    // this.month = content;
    let m = 'J';
    switch (this.month) {
      case 1: m = 'F'; break;
      case 2: m = 'M'; break;
      case 3: m = 'A'; break;
      case 4: m = 'M'; break;
      case 5: m = 'J'; break;
      case 6: m = 'J'; break;
      case 7: m = 'A'; break;
      case 8: m = 'S'; break;
      case 9: m = 'O'; break;
      case 10: m = 'N'; break;
      case 11: m = 'D'; break;

    }
    this.content = m;
  }
}
export class DecadeContent extends TextContent {


  constructor(Id: string,
    stateName: string,
    private year: number,
    fromSource: boolean = false,
    angle: number = 0) {
    super(Id,
      stateName,
      "",
      year.toString(),
      fromSource,
      angle);

  }

  Update(content: number) {
    this.year += (content * 10);
    this.year = Math.floor(this.year / 10) * 10;
    this.content = this.year.toString();
  }
}

export class CenturyContent extends TextContent {

  constructor(Id: string,
    stateName: string,
    private year: number,
    fromSource: boolean = false,
    angle: number = 0) {
    super(Id,
      stateName,
      "",
      year.toString(),
      fromSource,
      angle);

  }

  Update(content: number) {
    this.year += (content * 100);
    this.year = Math.floor(this.year / 100) * 100;
    this.content = this.year.toString();
  }
}

export interface ITimeLine {
  //  Update();
}

export class TimeLineModel {
  private _theTimeLine: ITimeLine;
  private _unitRange: number = 0;

}

export class TimeLineSlider extends Rectangle {

  _line: Line;
  _path: Point[] = [];

  _centerLine: Line;
  _centerPath: Point[] = [];
  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number) {
    super(id,
      top,
      left,
      width,
      height,
      'TimeSpansss',
      0);

    this._freedomOfSizing = FreedomOfMotion.horizontal;
    this._freedomOfMotion = FreedomOfMotion.horizontal;

    this._line = new Line("TimeSpanLine", 'TimeSpanLine', 0);
    this._path.push(new Point());
    this._path.push(new Point());

    this._centerLine = new Line("TimeSpanLine", 'TimeSpanLine', 0);
    this._centerPath.push(new Point());
    this._centerPath.push(new Point());
    this.SetLinePath();

  }

  //MoveBy(x: number, y: number) {
  //    if( x > 0){
  //      let sss = 0;
  //  }
  //  //if (AreaSizer.MoveSide(x, y, this)) {
  //  //  return;
  //  //}

  //  super.MoveBy(x, y);
  //  AreaSizer.MoveItem(x, y);

  //}

  Draw(context: CanvasRenderingContext2D) {

    console.error("LEFT ++++++++++++++++>" + this.Left);
    super.Draw(context);
    AreaSizer.Draw(context);
    this.SetLinePath();
    this._line.DrawLine(context, this._path);
    this._centerLine.DrawLine(context, this._centerPath);
  }

  IsPointInShape(point: Point) {
    if (AreaSizer.select(point)) {
      return true;
    }
    if (super.IsPointInShape(point)) {

      return true;
    }
    return false;
  }

  SetLinePath() {

    let b = this.Bottom + 2;
    this._path[0].SetToPosition(this.Left, b);
    this._path[1].SetToPosition(this.Right, b);
    let center = (this.Right - this.Left) / 2;
    center += this.Left;
    this._centerPath[0].SetToPosition(center, this.Top);
    this._centerPath[1].SetToPosition(center, b);

  }

  UpdatePosition(left: number, right: number): boolean {
    if (left > right) {
      return false;
    }
    let w = right - left;
    if (w <= 0) {
      return;
    }
    let properties = {
  
      "width": w
    }
    this.SetProperties(properties);
    this.MoveTo(left, this.Top);
    AreaSizer.Reset(this);
    this.SetLinePath();
    //this._path[0].SetToPosition(this.Left, b);
    //this._path[1].SetToPosition(this.Right, b);
    //let center = (this.Right - this.Left) / 2;
    //center += this.Left;
    //this._centerPath[0].SetToPosition(center, this.Top);
    //this._centerPath[1].SetToPosition(center, b);
    return true;
  }
}

export class TimeLineMarker extends GradientRectangle {
  //  private _sizer: Sizer;
  _line: Line;
  _path: Point[] = [];
  _content: Content;
  _dateValue: number;

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    state: string,
    content: Content) {
    super(id,
      top,
      left,
      width,
      height,
      state,
      1);
    this._content = content;
    this._dateValue = parseInt(this._content.Content);
    let sss = 0;
  }
  get Content(): Content {
    return this._content;
  }

  get Value() { return this._content.Content; }
  get DateValue() { return this._dateValue; }
  
  Update(value: string) {
    this._content.Update(value);
    this._dateValue = parseInt(value);
  }

  IsDateValue(value: number) {
    return this._dateValue == value;
  }

  MoveBy(x: number, y: number) {
    super.MoveBy(x, 0);
  }

  SetLinePath() {
    let b = this.Bottom + 2;
    //  this._path[0].SetToPosition(this.Left, b);
    //  this._path[1].SetToPosition(this.Right, b);
  }

  Draw(context: CanvasRenderingContext2D) {
    super.Draw(context);
    this._content.Draw(context, this);
    //  this._line.DrawLine(context, this._path);
  }
}
export class ContentFactory {

}

export class TimeLineRange { // Data Model

  private _referenceDate: Date;
  private _offsetFirst: number = 0;
  private _offsetFinal: number = 0;

  _line: Line;
  _path: Point[] = [];

  constructor(

    style: string,
    private _name: string,
    private _discription: string,
    private _dateFirst: Date,
    private _dateFinal: Date) {

    this._referenceDate = new Date(1900, 1, 1, 0, 0, 0, 0);
    this._line = new Line("TimeRangeLine", style, 0);
  }

  SetOffsets(markerWidth: number,date1:number,date2: number) {

    this._offsetFirst = this.convertDateToOffset(markerWidth, this._dateFirst);
    this._offsetFinal = this.convertDateToOffset(markerWidth, this._dateFinal);
    let d = this._dateFirst.getFullYear() - date1;
    this._offsetFirst += d * markerWidth;
    d = this._dateFinal.getFullYear() - date1;
    this._offsetFinal += d * markerWidth;

    if (this._path.length <= 0) {
      this._path.push(new Point(this._offsetFirst, 20));
      this._path.push(new Point(this._offsetFinal, 20));
    }
    else {
      this._path[0].SetToPosition(this._offsetFirst, 20);
      this._path[1].SetToPosition(this._offsetFinal, 20);
    }
  }

  convertDateToOffset(markerWidth: number, date: Date = new Date()) {
    this._referenceDate.setFullYear(date.getFullYear());
    let d = date.getTime() - this._referenceDate.getTime(); // milleseconds
    d /= 1000; // seconds
    d /= 3600; // hours;
    d /= 24; // Days.
    let offset = markerWidth / 365;
    return offset * d;
  }

  UpdateOffset(marker: TimeLineMarker) {
    if (marker.DateValue == this.DateFirst.getFullYear()) {
      this._offsetFirst += marker.Left;
    }
    if (marker.DateValue == this.DateFinal.getFullYear()) {
      this._offsetFinal += marker.Left;
    } 
  }

  get Name() {
    return this._name;
  }

  get DateFirst() {
    return this._dateFirst;
  }

  get DateFinal() {
    return this._dateFinal;
  }

  get OffsetFirst() {
    return this._offsetFirst;
  }

  get OffsetFinal() {
    return this._offsetFinal;
  }

  get Description() {
    return this._discription;
  }

  SetLinePath(offset: number) {

    this._path[0].SetToPosition( this._offsetFirst, offset );
    this._path[1].SetToPosition( this._offsetFinal, offset );

  }

  Draw(context: CanvasRenderingContext2D) {

    this._line.DrawLine(context, this._path);

  }
}

export abstract class RangeCatalog {// Data Model

  static _catalog: TimeLineRange[] = [];

  static AddTimeRange(timeRange: TimeLineRange) {
    if (!timeRange) {
      return;
    }
    this._catalog.push(timeRange);
  }

  static Catalog(date1: Date, date2: Date, markerWidth: number): TimeLineRange[]{
    let c = this._catalog
      .filter(r =>
        (r.DateFirst >= date1 && r.DateFirst <= date2) ||
        (r.DateFinal >= date1 && r.DateFinal <= date2));

    c.forEach(rr => rr.SetOffsets(markerWidth, date1.getFullYear(), date2.getFullYear() ));

    return c;
  }
}

export abstract class TimeLine extends ShapeContainer implements ITimeLine {
  protected _span: number[] = [0, 0];
  protected _visibleCatalog: TimeLineRange[] = [];
  protected _temporalOffset: number = 0;
  protected _content: ShapeContainer;
  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    protected _unitSize: number) {

    super(new Rectangle(id,
      top,
      left,
      width,
      height,
      stateName,
      1));

  }
  abstract InitToDate(date: Date);
  abstract Init();
  abstract TimeUnit(Id: string,
    stateName: string,
    value: number,
    shape: IShape,
    fromSource: boolean,
    angle: number): TextContent;

  public Draw(context: any) {
    super.Draw(context);
    this._visibleCatalog.forEach(c => c.Draw(context));
  }

  CheckRangeCatalog() {
    
    const dateA = new Date(this._span[0], 1, 1, 0, 0, 0, 0);
    const dateB = new Date(this._span[1], 1, 1, 0, 0, 0, 0);
  //  let cA = this.Contents.find(c => (<TimeLineMarker>c).Content.Content == this._span[0].toString());
  //  let cB = this.Contents.find(c => (<TimeLineMarker>c).Content.Content == this._span[1].toString());

// Need the offset of the marker for the catalog years!!!!!!!!!!!!!!!!!!!!
    this._visibleCatalog = RangeCatalog.Catalog(dateA, dateB, this.Contents[0].Width);
    
      // get offset for each date in catalog
      //this._visibleCatalog.forEach(function (t, i) {
      //  this.Contents.forEach(c => (<TimeLineMarker>c).IsDateValue(t.DateFirst.getFullYear()));
        
      //});

 

 

  }

  private convertAreaToDate(areaOffset: number, marker: TimeLineMarker): Date {

    const year = parseInt(marker.Value);
    let date = new Date(year, 1, 1,0,0,0,0);
    areaOffset = areaOffset - marker.Left;
    let daysOffset = Math.round((areaOffset / marker.Width) * 365);
    date.setDate(date.getDate() + daysOffset);
    return date;

  }

  CalculatDateFromTimeSpan(area: IShape, date: IDataResult) {

    let center = area.Left + (area.Right - area.Left) / 2;
    let marker = this.Contents.find(c => c.Left < center && c.Right > center );
  
    if (marker) {
      
      let date1 = this.convertAreaToDate(center, marker as TimeLineMarker);
      date.Update(date1);

    }
  }

  CalculatDataFromTimeSpan(area: IShape, data: IDataResult) {

    let result = this.Contents.filter(c => c.Right > area.Left);
    result = result.filter(c => c.Left < area.Right);
    let count = result.length;
    if (count > 0) {
      let center = area.Left + ((area.Right - area.Left) / 2);
      let marker = this.Contents.find(c => c.Left < center && c.Right > center);

      let range: Date[] = [];
      let date1 = this.convertAreaToDate(area.Left, result[0] as TimeLineMarker);
      let date2 = this.convertAreaToDate(area.Right, result[count - 1] as TimeLineMarker);
      let date3 = this.convertAreaToDate(center, marker as TimeLineMarker);

      range.push(date1);
      range.push(date2);
      range.push(date3);

      data.Update(range);

    }
  }

  ConvertDateToTimeOffset(date : Date) : number {

    let t = date.getTime();
    t /= 1000; // seconds
    t /= 3600; // hours;
    t /= 24; // Days.

    const y = date.getFullYear();
    const m = this.Contents.find(c => (<TimeLineMarker>c).IsDateValue(y));
    if (!m) { return 0;}
    let dayWidth = m.Width / 365;
    let refYear = new Date(y, 1, 1, 0, 0, 0, 0);
    let t2 = refYear.getTime();
    t2 /= 1000; // seconds
    t2 /= 3600; // hours;
    t2 /= 24; // Days.
    t -= t2;

    t *= dayWidth;
    
    return m.Left + t;
    
  }

  ClearHit() {
    super.ClearHit();
  }

  ShiftDiscreteContent(dx: number, boundingAreaRight: number) {
    super.ShiftDiscreteContent(dx, boundingAreaRight);
    this.ShiftContinuousContent(dx, boundingAreaRight);

  //  this.CheckRangeCatalog();
  }

  public UnSelect() {
    if (this.IsSelected) {
      super.UnSelect();
      this.Contents = this._trackdContents.concat([]);
      this._trackdContents = [];

    }
  }

  public Selected(point: Point): boolean {
    if (super.Selected(point)) {
      this._trackdContents = this.Contents.concat([]);
      this.Contents = [];
      return true;
    }
    return false;
  }
}

export abstract class TimeLineByYear extends TimeLine {


  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    protected _referenceYear: number = -1,
    unitSize: number) {

    super(id,
      top,
      left,
      width,
      height,
      stateName,
      unitSize);

    this.Init();
  }

  abstract Range: number;


 

  AddToFront(c: IShape) {
    let len = this._trackdContents.length;
    let v = (<TimeLineMarker>this._trackdContents[len - 1]).Value;
    let y = parseInt(v, 10);
    y = y + 1;
    this._span[1] = y;
    (<TimeLineMarker>c).Update(y.toString());
    super.AddToFront(c);
  }

  AddToBack(c: IShape) {
    let v = (<TimeLineMarker>this._trackdContents[0]).Value;
    let y = parseInt(v, 10);
    y = y - 1;
    this._span[0] = y;
    (<TimeLineMarker>c).Update(y.toString());
    super.AddToBack(c);
  }

  get offsetRange() {
    let range = this._temporalOffset / this._unitSize;
    return this._referenceYear - Math.round(range);
  }

  //Update() {
  //  this.Contents.forEach(c => c.Update(this.offsetRange));
  //}

  //SetTimeLine(parent: Rectangle) {
  //  parent.SetShapes(this.Contents);
  //}

  get ReferenceYear() {
    if (this._referenceYear == -1) {
      let d = new Date();
      this._referenceYear = d.getFullYear();
    }
    return this._referenceYear;
  }

  InitToDate(date: Date) {
    this._referenceYear = date.getFullYear();
    this.InitToRange();
  }

  InitToRange() {

    this.ClearContent();
    let padding = this._unitSize * 3;
    let leftbound = this.Left - padding;
    let position = Math.round(this.Right + padding );
    let refYear = this.ReferenceYear + Math.round((( position - leftbound )/ this._unitSize) / 2);
    this._span[1] = refYear;
    refYear = Math.floor(refYear / this.Range) * this.Range;
    let count = 0;
    for (; position > leftbound ; position -= this._unitSize) {
      let y = refYear.toString();
      let state = (count % 2 == 0) ? 'OddSlot' : 'OddSlot';
      let c = new TextContent("timelineSlot_text_" + y, "DefaultFG", "", y);
      let s = new TimeLineMarker(
        "timelineSlot_" + count,
        this.Top,
        position - this._unitSize,
        this._unitSize, 16, state, c);
      this._span[0] = refYear;
      this.AddContentsss(s);
      refYear -= this.Range;
      count++;
    }

    //  if (count % 2 != 0) { this.Contents.pop(); }// Ensure the range length is always an odd number (otherwise the color coding will be wrong)...
  }
}

export class TimeLineByYearModelH extends TimeLineByYear {

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    year: number = -1,
    unitSize: number) {

    super(id,
      top,
      left,
      width,
      height,
      stateName,
      year,
      unitSize);

  }

  get Range() { return 1; }

  Init() {
    super.InitToRange();
  }

  TimeUnit(Id: string,
    stateName: string,
    year: number,
    shape: IShape,
    fromSource: boolean = false,
    angle: number = 0): TextContent {
    return new YearContent(Id, stateName, year, fromSource, angle);
  }
}

export class TimeByDecadeModelH extends TimeLineByYear {
  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    year: number = -1,
    unitSize: number,
    referenceYear: number = -1) {

    super(id,
      top,
      left,
      width,
      height,
      stateName,
      year,
      unitSize);
  }

 // CalculatTimeSpan(area: IShape) { }
  get Range() { return 10; }

  Init() {
    super.InitToRange();
  }
  TimeUnit(Id: string,
    stateName: string,
    year: number,
    shape: IShape,
    fromSource: boolean = false,
    angle: number = 0): TextContent {
    return new DecadeContent(Id, stateName, year, fromSource, angle);
  }
}

export class TimeByCenturyModelH extends TimeLineByYear {
  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    year: number = -1,
    unitSize: number) {

    super(id,
      top,
      left,
      width,
      height,
      stateName,
      year,
      unitSize);

  }

  get Range() { return 100; }

  Init() {
    this.InitToRange();
  }

 // CalculatTimeSpan(area: IShape) { }

  TimeUnit(Id: string,
    stateName: string,
    year: number,
    shape: IShape,
    fromSource: boolean = false,
    angle: number = 0): TextContent {
    return new CenturyContent(Id, stateName, year, fromSource, angle);
  }
}


export class TimeLineByHourModel {

}

export class TimeLineByDayModel {

}

export class TimeLineByWeekModel {

}

export class TimeMonthModel extends TimeLine {

  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    unitSize: number) {

    super(id,
      top,
      left,
      width,
      height,
      stateName,
      unitSize);

    this.Init();
  }

  Init() {
    let position = Math.round(DisplayValues.Width);
    let unitSize = DisplayValues.Width / 12;
    let count = 11;
    for (; position > this.Left - this.Width; position -= unitSize) {
      let state = (count % 2 == 0) ? 'EvenSlot' : 'OddSlot';
      let s = new Rectangle(
        "timelineSlot_" + count,
        this.Top,
        position - unitSize,
        unitSize, this.Height, state);
      let c = this.TimeUnit("timelineSlot_text_" + count, state, count, s, false, 0);
      count--;
      if (count < 0) {
        count = 11;
      }
    }

  }

  InitToDate(date: Date) {}
  //CalculatTimeSpan(area: IShape) { }
  //Update() {
  //  this.Contents.forEach(c => c.Update(0));
  //}

  TimeUnit(Id: string,
    stateName: string,
    year: number,
    shape: IShape,
    fromSource: boolean = false,
    angle: number = 0): TextContent {
    return new MonthContent(Id, stateName, year, fromSource, angle);
  }
}

//export class TimeLineCoordinator {

//  constructor(
//    private _timeLine: TimeLine[] = []) {
//  }
//}

//export class ContentRange {
//  private _contentRange: ContentShape[] = [];

//}
