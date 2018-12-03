import { ContextLayer, IContextItem } from '../../../../IContextItem';
import { Point } from '../../../../shapes/point';
import { Line } from '../../../../lines/line';
import { Text } from '../../../../shapes/content/text/text';
import { StateIndex, UIStates } from '../../../../DisplayValues'
import * as moment from 'moment';

// tick { length:0 offset:0, label:{value:'',state:0}[] }
// axisName

export class Tick {
  constructor(public labels: {lable:string,width:number, height: number,angle:number = 0} [],
    public startPosition: number,
    public length: number,
    public offset: number,
    public baseLine: number,
    public intervalSize: number) { }
}

export class NumericScale {


 // inc: number = 0; // ie 10,20,etc...
  constructor(private min: number = 0, private max: number = 0, private base:number,  private inc: number = 1, private stub:string = '') {
    if (this.inc < 1) this.inc = base;
  }

  Labels() {

    let labels: string [] = [];

    for (let i = this.min; i <= this.max; i += this.inc) {
      labels.push((i % this.base == 0) ? i.toString() : this.stub );
    }
  }
}

export enum TimeRangeType {
  second = 0,
  minute = 1,
  hour = 2,
  day = 3,
  week = 4
  month = 5,
  year = 6
}


export class CalendarScale {
  constructor(private firstDate: Date, private finalDate: Date, private interval: TimeRangeType, private abbreviate:number = 0) {

  }

 
  Labels() {

    let m1 = moment(this.firstDate);
    let m2 = moment(this.finalDate);
    let d: number = 0;
    switch (this.interval) {
      case TimeRangeType.day: d = m2.diff(m1, 'days'); break;
      case TimeRangeType.week: d = m2.diff(m1, 'weeks'); break;
      case TimeRangeType.month: d = m2.diff(m1, 'months'); break;
      case TimeRangeType.year: d = m2.diff(m1, 'years'); break;
    }

    let labels: string[] = [];

    for (let i = this.firstDate; i <= this.max; i += this.inc) {
      
    }
  }
}

export class ClockScale {
  constructor(private firstDate: Date, private finalDate: Date, private interval: TimeRangeType) {

  }

  Labels() {

    let labels: string[] = [];

    for (let i = this.firstDate; i <= this.max; i += this.inc) {
      labels.push((i % this.base == 0) ? i.toString() : this.stub);
    }
  }
}

export class AxisLayer extends ContextLayer {

  constructor(width: number, height: number, vTick: Tick, hTick: Tick, chartState: StateIndex) {
    super('axislines', 'default');

    //this.yLineState = new StateIndex('line1');
    //this.yLineState.setState(UIStates.background, 2);
    //this.yLineState.setState(UIStates.foreground, 1);
    //this.yLineState.setState(UIStates.color, 4);
    //this.yLineState.setState(UIStates.weight, 0);
    const h = height - 30;
    const origin: Point = new Point(10, h)
    super.AddContent(new Line('yLine', origin, new Point(10, 10), chartState));

    //this.xLineState = new StateIndex('line1');
    //this.xLineState.setState(UIStates.background, 2);
    //this.xLineState.setState(UIStates.foreground, 1);
    //this.xLineState.setState(UIStates.color, 4);
    //this.xLineState.setState(UIStates.weight, 0);

    super.AddContent(new Line('xLine', origin, new Point(width - 30, h), chartState));

    this.addYTickLine(vTick, chartState);
    this.addXTickLine(hTick, chartState);
  }

  addLabel(id: string, label: any, top: number, left: number, chartState: StateIndex) {
    this.AddContent(new Text(
      id, top, left,
      label.width, label.height,
      chartState, label.label, label.angel));
  }

  addYTickLine(tick: Tick, chartState: StateIndex) {
    let offset = tick.baseLine - tick.length + tick.offset;
    for (let i = 0; i < tick.labels.length; i = i + 1) {
      this.AddContent(new Line('tic_' + i,
        new Point(offset, tick.startPosition),
        new Point(tick.baseLine, tick.startPosition),
        chartState));
      this.addLabel('lbl_' + i,
        tick.labels[i], tick.startPosition,
        offset - tick.labels[i].width, chartState);
     tick.startPosition -= tick.intervalSize;
    }
  }

  addXTickLine(tick: Tick, chartState: StateIndex) {
    let offset = tick.baseLine + tick.length + tick.offset;
    for (let i = 0; i < tick.labels.length; i = i + 1) {
      this.AddContent(new Line('tic_' + i,
        new Point(tick.startPosition,offset),
        new Point(tick.startPosition,tick.baseLine),
        chartState));
      this.addLabel('lbl_' + i,
        tick.labels[i], tick.startPosition,
        tick.startPosition, chartState);
      tick.startPosition += tick.intervalSize;
    }
  }
}
