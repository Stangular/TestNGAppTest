import { Rectangle } from "../../shapes/rectangle";
import { IShape } from "../../shapes/IShape";
import { ContextLayer, ActionLayer, EventContextLayer, TrackerFactory, AreaSizer, AreaTracker, LinearTracker } from "../../IContextItem";
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
import { Shape } from "../../shapes/shape";

export enum TimeLineTypes {
  year = 0,
  decade = 1,
  century = 2,
  month = 3,
  day = 4,
  hour = 5,
  minute = 6
}

export class TimeLineBaseLayerModel extends EventContextLayer {

  //  private _contextOffset = 0;
  //_timeLine: ITimeLine[] = [];
  // protected _activeSlider: TimeLineSlider = null;

  constructor(
    parentArea: Rectangle,
    private _endDate: Date, // date to count back from
    private _span: number, // number of units to include
    private _size: number, // size of time line unit?   level: time part counting from...
    private _level: number,
    private _timeLineType: TimeLineTypes = TimeLineTypes.year,
    protected year: number = -1) {

    super(
      parentArea,
      'timeline'
      , 'timeline'
      , 'sss'
      , new Date()
      , '');
    TrackerFactory.Clear();
    TrackerFactory.AddTracker(new AreaTracker());
    TrackerFactory.AddTracker(new AreaSizer());
    TrackerFactory.AddTracker(new LinearTracker(this.ParentArea.Right));
    this.ResetTimeLine(this.ParentArea, this._timeLineType);
  }

  GetTouchedShape(point: Point): IShape { return null }
  ReturnTouchedShape(shape: IShape) { }

  ResetTimeLine(parentArea: Rectangle, timeLineType: TimeLineTypes = TimeLineTypes.year): void {
    this.ClearContent();
    //    this.AddContent(new TimeLineSlider("year", 0, 100, 80, 300));
    switch (timeLineType) {
      case TimeLineTypes.century:
        this.AddContent(new TimeByCenturyModelH('timeline1', 0, 0, parentArea.Width, 30, 'boundingArea', this.year, 100));
        break;
      case TimeLineTypes.decade:
        this.AddContent(new TimeByDecadeModelH('timeline1', 0, 0, parentArea.Width, 30, 'boundingArea', this.year, 100));
        break;
      case TimeLineTypes.month:
        this.AddContent(new TimeMonthModel('timeline_month', 40, 0, parentArea.Width, 16, 'boundingArea', 100));
        this.AddContent(new TimeLineSlider('timelineSpan_timeline_span', 40, 100, 80, 16));
        break;
      default:
        this.AddContent(new TimeLineByYearModelH('timeline_year', 0, 0, parentArea.Width, 16, 'boundingArea', this.year, 100));
        this.AddContent(new TimeLineSlider('timelineSpan_timeline_span', 0, 100, 80, 16));
        this._tracker.Reset(this.Content[1] as IShape);
    }
    this._timeLineType = timeLineType;

  }

  get TimeLineType() { return this._timeLineType; }

  resetTimeLine() {
    this.Content[0]
  }

  Area(which: number = 0) {
    return this.Content[which] as Rectangle;
  }

  LoadCanvasData(inputData: any): Promise<any> { return null;}
  UpdateCanvasData(inputData: any) { }

  GetContextData(): any {
    return null;
  }

  AutoUpdate(): boolean {

    if (this._tracker.TrackedArea &&
      this._tracker.TrackedArea.Id == 'timelineSpan_timeline_span') {
      let direction = 0;
      if (this._tracker.TrackedArea.Left < this.ParentArea.Left) {
        let d = this.ParentArea.Left - this._tracker.TrackedArea.Left;
        direction = Math.floor((d / this.ParentArea.Width) * 10 ) + 1;
      }
      if (this._tracker.TrackedArea.Right > this.ParentArea.Right) {
        let d = this._tracker.TrackedArea.Right - this.ParentArea.Right;
        direction = -Math.floor((d / this.ParentArea.Width) * 10) - 1;
      }
      if (direction) {
        let timeLine = this.ContentFromID('timeline_year') as TimeLine;
    //    timeLine.Contents.forEach((s, i) => s.Shape.MoveBy(direction, 0));
    //    timeLine.ShiftContent(new Point(0, 0), this.ParentArea.Right);
        return true;
      }
    }
    return false;
  }


  //selectItem(event: any, context: CanvasRenderingContext2D): void {

  //  super.selectItem(event, context);
  //  let d = this._tracker.mouseCapture(event, this.ParentArea);
  //  let t = this._tracker.TrackedArea;
  //  if (!this._tracker.Track(d)) {
  //    let c = this.RemoveContentByPoint(d) as IShape;
  //    if (c) {
  //      this._tracker = TrackerFactory.GetTracker(c.Id);
  //      this._tracker.Reset(c);
  //    }
  //    else {
  //      this._tracker.Reset(null);
  //    }

  //  }
  //  else if (t) {
  //    this.RemoveContentById(t.Id);
  //  }
  //  this.ClearContext(context);
  //  this._tracker.Draw(context, true);
  //}

  //releaseSelectedItem(context: CanvasRenderingContext2D) {

  ////  this._tracker.mouseRelease();

  //  this.PutContentItem(this._tracker.TrackedArea);
  //  if ((!this._tracker || !this._tracker.TrackedArea) && this.content.length != 2) {
  //    this.ClearContent();
  //    this._tracker = new AreaSizer();
  //    this.AddContent(new TimeLineByYearModelH('timeline_year', 0, 0, this.ParentArea.Width, 16, 'boundingArea', this.year, 100));
  //    this.AddContent(new TimeLineSlider('timelineSpan_timeline_span', 0, 100, 80, 16));
  //    this._tracker.Reset(this.Content[1] as IShape);
  //    this.ClearContext(context);
  //    this.Draw(context);
  //    return;
  //  }
  //  this.ClearContext(context);
  //  this.Draw(context);

  //  if (this._tracker.TrackedArea && this._tracker.TrackedArea.Id == 'timelineSpan_timeline_span') {
  //    this._tracker.Reset(this._tracker.TrackedArea);
  //    this._tracker.Draw(context, false);
  //  }
  //  else {
  //    this._tracker = TrackerFactory.GetTracker('timelineSpan_timeline_span');
  //    if (this._tracker) {
  //      this._tracker.Reset(this.content[1] as IShape);
  //      this._tracker.Draw(context, false);
  //    }
  //  }


  //  let span = this.ContentFromID('timelineSpan_timeline_span') as Rectangle;
  //  let timeLine = this.ContentFromID('timeline_year') as TimeLine;
  //  if (timeLine) {
  //    let dr: DateRange = timeLine.DateFromArea(span);
  //  }

  //}

  //mouseMove(event: any, context: CanvasRenderingContext2D): Point {
  //  return super.mouseMove(event, context);
  //  if (p.X <= 0 && p.Y <= 0) { return p; }
  //  //if (this._tracker.TrackedArea && this._tracker.TrackedArea.Id == 'timelineSpan_timeline_year');
  //  //{
  //  //  let d = this._tracker.TrackedArea.Left;
  //  //  if (d < 0) {
  //  //    let timeLine = this.ContentFromID('timeline_year') as TimeLine;
  //  //    timeLine.Contents.forEach((s, i) => s.Shape.MoveBy(-d, 0));
  //  //    timeLine.ShiftContent(new Point(-d, 0), this.ParentArea.Right);
  //  //   timeLine.DrawContent(context);
  //  //    this._tracker.TrackedArea.Draw(context);
  //  //  }
  //  //}
  //  return p;
  //}
}
