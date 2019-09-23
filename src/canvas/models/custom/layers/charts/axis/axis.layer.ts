import { ContextLayer, IContextItem } from '../../../../IContextItem';
import { Point } from '../../../../shapes/primitives/point';
import { Size } from '../../../../shapes/primitives/size';
import { Margin } from '../../../../shapes/primitives/margin';
import { Line } from '../../../../lines/line';
import { TextShape, TextCenter } from '../../../../shapes/content/text/text';
import { StateIndex, UIStates } from '../../../../DisplayValues'
import * as moment from 'moment';

// tick { length:0 offset:0, label:{value:'',state:0}[] }
// axisName


export interface IScale {
  Labels(): any[];
}


export class Tick {
  constructor(public labeling: { scale: IScale, width: number, height: number, angle: number }[],
    public length: number,
    public offset: number,
    public baseLine: number) { }
}

export class Scale implements IScale {

  constructor(private labels: any[]) { }

  Labels() {
    return this.labels;
  }
}

export class NumericScale implements IScale {

  labels: any[] = [];
  // inc: number = 0; // ie 10,20,etc...
  constructor(private min: number = 0, private max: number = 0, private base: number,
    private inc: number = 1, private stub: string = '', private append: string = '') {
    if (this.inc < 1) { this.inc = base; }
    this.SetLabels();
  }

  Labels() {
    return this.labels;
  }

  SetLabels() {
    this.labels = [];

    for (let i = this.min; i <= this.max; i += this.inc) {

      this.labels.push({ label: (i % this.base == 0) ? i.toString() + this.append : this.stub, id: '' });
    }
    this.labels.push();
  }
}

export enum TimeRangeType {
  second = 0,
  minute = 1,
  hour = 2,
  day = 3,
  week = 4,
  month = 5,
  year = 6
}


export class TimeScale implements IScale {

  labels: string[] = [];

  constructor(private firstDate: Date, private finalDate: Date, private base: number,
    private interval: TimeRangeType, private rangeNames: string[], private stub: string = '') {
    this.SetLabels();
  }

  Labels() {
    return this.labels;
  }

  SetLabels() {

    let m1 = moment(this.firstDate);
    let m2 = moment(this.finalDate);
    let d: number = 0;
    switch (this.interval) {
      case TimeRangeType.day: d = m2.diff(m1, 'days'); break;
      case TimeRangeType.week: d = m2.diff(m1, 'weeks'); break;
      case TimeRangeType.month: d = m2.diff(m1, 'months'); break;
      case TimeRangeType.year: d = m2.diff(m1, 'years'); break;
    }


    for (let i = 0; i <= d; i = i + 1) {
      let valu: number;
      switch (this.interval) {
        case TimeRangeType.day:
          valu = m1.days();
          m1.days(valu + 1);
          break;
        case TimeRangeType.week:
          valu = m1.weeks();
          m1.weeks(valu + 1);
          break;
        case TimeRangeType.month:
          valu = m1.months();
          m1.months(valu + 1);
          break;
        case TimeRangeType.year:
          valu = m1.years();
          m1.years(valu + 1);
          break;
      }
      if ((valu % this.base !== 0)) {
        this.labels.push(this.stub);
      }
      else if (this.rangeNames.length > valu) {
        this.labels.push(this.rangeNames[valu]);
      }
      else {
        this.labels.push(valu.toString());
      }
    }
  }
}

export class AxisLayer {// extends ContextLayer {

  xTicks: { point: Point, id: string }[] = [];
  yTicks: Point[] = []
  constructor(private margins: Margin, private size: Size, private xTick: Tick, private yTick: Tick, chartState: StateIndex) {
    //super('axislines', 'default');


    const origin: Point = new Point(margins.Left, size.Height);

    this.addYTickLine(yTick, chartState, origin);
    this.addXTickLine(xTick, chartState, origin);
  }

  addLabel(id: string, label: any, top: number, left: number, width: number, height: number, angle: number, chartState: StateIndex) {
    //this.AddContent(new TextCenter(
    //  id, top, left,
    //  width, height,
    //  chartState, label, angle));
  }

  get XTick() {
    return this.xTick;
  }

  get YTick() {
    return this.yTick;
  }

  get XTicks() {
    return this.xTicks;
  }

  get YTicks() {
    return this.yTicks;
  }

  addYTickLine(tick: Tick, chartState: StateIndex, origin: Point) {

   // super.AddContent(new Line('yLine', origin, new Point(this.margins.Left, this.margins.Top), chartState));

    let self = this;
    let start = origin.Y;
    let offset = this.margins.Left - tick.length + tick.offset;
    let count = tick.labeling[0].scale.Labels().length;
    let pt: Point;
    let intervalSize = Math.round((this.size.Height - this.margins.Top) / count);
    for (let i = 0; i < count; i = i + 1) {
      pt = new Point(origin.X, start);
      //this.AddContent(new Line('ytic_' + i,
      //  new Point(offset, start),
      //  pt,
      //  chartState));
      start -= intervalSize;
      this.yTicks.push(pt);
    }
    let x = 0;
    start = origin.Y;
    offset = offset - tick.length - 5;
    tick.labeling.forEach(function (label, i) {
      x = (label.height / 2);
      let lbls = label.scale.Labels();
      for (let j = 0; j < lbls.length; j = j + 1) {
        self.addLabel('lbl_' + j,
          lbls[j].label, start - x,
          offset - label.width, label.width, label.height, label.angle, chartState);
        start -= intervalSize;
      }
    });
  }

  addXTickLine(tick: Tick, chartState: StateIndex, origin: Point) {

    let width = this.size.Width - (this.margins.Left + this.margins.Right);
    width -= 50;
    //super.AddContent(new Line('xLine', origin, new Point(width, this.size.Height), chartState));

    let self = this;
    let count = tick.labeling[0].scale.Labels().length;
    let intervalSize = width / count;
    let start = origin.X + (intervalSize / 2);
    let h = origin.Y;
    let pt: Point;
    
    tick.labeling[0].scale.Labels().forEach(function (l,i) {
      pt = new Point(start, h);
      //self.AddContent(new Line('xtic_' + i,
      //  pt,
      //  new Point(start, h + 5),
      //  chartState));
      self.xTicks.push({ point: pt, id: l.id });
      start += intervalSize;
    });
   
    let x = 0;
    h += 6;

    tick.labeling.forEach(function (label, i) {
      start = origin.X + (intervalSize / 2);
      x = (label.width / 2);
      let lbls = label.scale.Labels();
      for (let j = 0; j < lbls.length; j = j + 1) {
        self.addLabel('lbl_' + j,
          lbls[j].label, h,
          start - x, label.width, label.height, label.angle, chartState);
        start += intervalSize;
      }
      h += label.height + 6; // '6' needs to be a define-abel property.
    });
  }
}
