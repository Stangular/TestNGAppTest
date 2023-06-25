import { extend } from "webdriver-js-extender";
import { Rectangle, GradientRectangle } from "src/canvas/models/shapes/rectangle";
import { AreaTracker, AreaSizer, LinearTracker, TrackerFactory } from "src/canvas/models/IContextItem";
import { Point } from "src/canvas/models/shapes/primitives/point";
import { DisplayValues, StateIndex } from "src/canvas/models/DisplayValues";
import { TextContent, IDynamicContent, Content } from "src/canvas/models/shapes/content/Content";
//import { TextShape } from "src/canvas/models/shapes/content/text/text";
import { ActionItemsss, IActionItem, IMouseState } from "src/canvas/component/layers/Interfaces/IActionLayer";
import { forEach } from "@angular/router/src/utils/collection";
import { IShape, FreedomOfMotion, ITracker } from "src/canvas/models/shapes/IShape";
//import { ContentShape } from "src/canvas/models/shapes/content/ContentShape";
import { Shape, ShapeContainer } from "src/canvas/models/shapes/shape";
import { Line } from "src/canvas/models/lines/line";

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

export interface ITimeLine  {
//  Update();
}

export class TimeLineModel {
  private _theTimeLine: ITimeLine;
  private _unitRange: number = 0;

}

export class TimeLineSlider extends Rectangle {
  //  private _sizer: Sizer;
  _line: Line;
  _path: Point[] = [];

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
    1);
    this._freedomOfSizing = FreedomOfMotion.horizontal;
    this._freedomOfMotion = FreedomOfMotion.horizontal;
    TrackerFactory.RegisterTracker('size_tracking', this.Id);
    this._line = new Line("TimeSpanLine", 'TimeSpanLine', 0);
    this._path.push(new Point());
    this._path.push(new Point());
    this.SetLinePath();
  }

  MoveBy(x: number, y: number) {
    super.MoveBy(x, y);
  }

  SetLinePath() {
    let b = this.Bottom + 2;
    this._path[0].SetToPosition(this.Left, b);
    this._path[1].SetToPosition(this.Right, b);
  }

  Draw(context: CanvasRenderingContext2D) {
    super.Draw(context);
    this.SetLinePath();
    this._line.DrawLine(context, this._path);
  }
}

export class TimeLineMarker extends GradientRectangle {
  //  private _sizer: Sizer;
  _line: Line;
  _path: Point[] = [];

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
  }

  MoveBy(x: number, y: number) {
    super.MoveBy(x, y);
  }

  SetLinePath() {
    let b = this.Bottom + 2;
    this._path[0].SetToPosition(this.Left, b);
    this._path[1].SetToPosition(this.Right, b);
  }

  Draw(context: CanvasRenderingContext2D) {
    super.Draw(context);
    this.SetLinePath();
    this._line.DrawLine(context, this._path);
  }
}
export class ContentFactory {

}

export abstract class TimeLine extends Rectangle implements ITimeLine {

  // protected 
 // protected _actionItem: ActionItemsss;
  protected _temporalOffset: number = 0;
  // protected _slider: TimeLineSlider = null;
  //protected _slider = new TimeLineSlider('timelineSpan_timeline_span', 0, 100, 80, 16);
  protected _content: ShapeContainer;
  constructor(id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    stateName: string = '',
    protected _unitSize: number) {
    super(id,
      top,
      left,
      width,
      height,
      stateName);
    
  //  this._actionItem = new ActionItemsss();
   // this._slider = new TimeLineSlider(id, top, 100, 80, 30);

    this._freedomOfSizing = FreedomOfMotion.none;
    this._freedomOfMotion = FreedomOfMotion.horizontal;

    TrackerFactory.RegisterTracker('linear_tracking', this.Id);
  }

 // abstract Update();
  abstract Init();
  abstract TimeUnit(Id: string,
    stateName: string,
    value: number,
    shape: IShape,
    fromSource: boolean,
    angle: number): TextContent;

  public DrawContent(context: any) {
    super.DrawContent(context);
    //this._slider.Draw(context);
  }

  ClearHit() {
    super.ClearHit();
  }

  //SelectContentFromPoint(point: Point): boolean {
  //  return super.SelectContentFromPoint(point);
  //}

  MoveIfHit(point: Point): boolean{
    return super.MoveIfHit(point);
  }

  //ConvertDateToPosition(date: Date) {

  //}

  //ConvertPositionToDate( position: number ) {
  //  let date = new Date();
  //  let c = this.Contents[this.Contents.length - 1];
  //  if (!c) { return date; }
  //  let p = position - c.Shape.Left;
  //  let d = p / this._unitSize;
  //  let f = Math.floor(d);
  //  let days = 365 * (d - f); // Don't worry about leap years
  //  let y = c as YearContent;
  //  date.setFullYear(y.Year + f);
  //  date.setMonth(0);
  //  date.setDate(days);
  //  return date;
  //}

  //DateFromArea(area: Rectangle): DateRange {
  //  return new DateRange(
  //    this.ConvertPositionToDate(area.Left),
  //    this.ConvertPositionToDate(area.Right));
  //}
}

export abstract class TimeLineByYear extends TimeLine {
  _contents: ShapeContainer = new ShapeContainer();
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
    else{
      this._referenceYear += (this.Width / this._unitSize ) / 2;

    }
    return this._referenceYear;
  }

  InitToRange(range: number = 1) {

    let position = Math.round(DisplayValues.Width);
    let refYear = this.ReferenceYear;

    refYear = Math.round(refYear / range) * range;
    let count = 0;
    for (; position > this.Left - this.Width; position -= this._unitSize) {
      let y = refYear.toString();
      let state = (count % 2 == 0) ? 'OddSlot' : 'OddSlot';
      let c = new TextContent("timelineSlot_text_" + y, "DefaultFG", y);
      let s = new TimeLineMarker(
        "timelineSlot_" + count,
        this.Top,
        position - this._unitSize,
        this._unitSize, 16, state,c );
      this._contents.AddContent(s);
      refYear -= range;
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

  Init() {
    super.InitToRange(10);
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

  Init() {
    this.InitToRange(100);
  }
  TimeUnit(Id: string,
    stateName: string,
    year: number,
    shape: IShape,
    fromSource: boolean = false,
    angle: number = 0): TextContent {
    return new CenturyContent(Id, stateName, year,fromSource, angle);
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
