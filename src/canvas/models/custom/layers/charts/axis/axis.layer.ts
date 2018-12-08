import { ContextLayer, IContextItem } from '../../../../IContextItem';
import { Point } from '../../../../shapes/point';
import { Line } from '../../../../lines/line';
import { Text, TextCenter } from '../../../../shapes/content/text/text';
import { StateIndex, UIStates } from '../../../../DisplayValues'
import * as moment from 'moment';

// tick { length:0 offset:0, label:{value:'',state:0}[] }
// axisName

export class Tick {
  constructor(public labeling: { scale: IScale, width: number, height: number, angle: number }[],
    public length: number,
    public offset: number,
    public baseLine: number) { }
}

export interface IScale {
  Labels(): string[];
}

export class NumericScale implements IScale {

  labels: string[] = [];
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

    for (let i = this.min; i < this.max - 1; i += this.inc) {

        this.labels.push((i % this.base == 0) ? i.toString() + this.append : this.stub);
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

export class AxisLayer extends ContextLayer {

  constructor(private width: number, private height: number, vTick: Tick, hTick: Tick, chartState: StateIndex) {
    super('axislines', 'default');

  
    this.height = this.height - 60;
    const origin: Point = new Point(50, this.height)
    super.AddContent(new Line('yLine', origin, new Point(50, 10), chartState));
    

    super.AddContent(new Line('xLine', origin, new Point(width - 30, this.height), chartState));

    this.addYTickLine(vTick, chartState, this.height);
    this.addXTickLine(hTick, chartState,50);
  }

  addLabel(id: string, label: any, top: number, left: number,width:number,height:number,angle:number, chartState: StateIndex) {
    this.AddContent(new TextCenter(
      id, top, left,
      width, height,
      chartState, label, angle));
  }

  addYTickLine(tick: Tick, chartState: StateIndex, baseline:number) {
    let self = this;
    let start = baseline;
    let offset = tick.baseLine - tick.length + tick.offset;
    let count = tick.labeling[0].scale.Labels().length;
    let intervalSize = Math.round(this.height / count);
    for (let i = 0; i < count; i = i + 1) {
      this.AddContent(new Line('ytic_' + i,
        new Point(offset, start),
        new Point(tick.baseLine, start),
        chartState));
      start -= intervalSize;
    }
    let x = 0;
    start = baseline;
    tick.labeling.forEach(function (label, i) {
      x = (label.height / 2 );
      let lbls = label.scale.Labels();
      for (let j = 0; j < lbls.length; j = j + 1) {
        self.addLabel('lbl_' + j,
          lbls[j], start - x,
          offset - label.width, label.width, label.height, label.angle, chartState);
        start -= intervalSize;
      }
    });
  }

  addXTickLine(tick: Tick, chartState: StateIndex,baseline: number) {
    let self = this;
    let offset = tick.baseLine + tick.length + tick.offset;
    let count = tick.labeling[0].scale.Labels().length;
    let intervalSize = this.width / count;
    let start = baseline;
    let h = this.height ;
    for (let i = 0; i < count; i = i + 1) {
      this.AddContent(new Line('xtic_' + i,
        new Point(start, h),
        new Point(start, h + 5),
        chartState));
      
      start += intervalSize;
    }
    let x = 0;
    start = baseline;

    tick.labeling.forEach(function (label, i) {
      x = (label.width / 2);
      let lbls = label.scale.Labels();
      for (let j = 0; j < lbls.length; j = j + 1) {
        self.addLabel('lbl_' + j,
          lbls[j], h + 6,
          start - x, label.width, label.height, label.angle, chartState);
        start += intervalSize;
      }
    });
  }
}
