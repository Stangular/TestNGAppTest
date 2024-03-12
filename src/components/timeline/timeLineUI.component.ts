import { Component, HostListener, AfterContentInit, OnInit } from '@angular/core';
import { TimeLineService } from './service/timeLine.service';
import { MessageService, InformationExchange } from 'src/app/messaging/message.service';
import { CanvasService } from 'src/canvas/service/canvas.service';


@Component({
  selector: 'time-line-UI',
  templateUrl: './timeLineUI.component.html',
  styleUrls: ['./timeLineManager.component.css']
})

export class TimeLineUIComponent implements AfterContentInit, OnInit {

  _year: number = 0;
  _month: number = 0;
  _day: number = 0;

  constructor(private timeLineService: TimeLineService, private messageService: MessageService, public canvasService: CanvasService) {

    let d = this.timeLineService.TimeLineDate;
    this._year = d.getFullYear();
    this._month = d.getMonth() + 1;
    this._day = d.getDate();

    this.canvasService.setExternalDataExchange( this.timeLineService.Data );
  }

  ngAfterContentInit() { }

  ngOnInit() { }


  ChangeDate() {
    this.timeLineService.ChangeDate(this._year, this._month, this._day);
    let m = new InformationExchange('20000', this.timeLineService.Data);
    this.messageService.sendMessage(m);
  }

  OnChangeFromYear1(e: any) {
    this.timeLineService.SetTimeLineRangeFirstYear(e.target.value);
    let m = new InformationExchange('20001', this.timeLineService.Data);
    this.messageService.sendMessage(m);
  }

  OnChangeFromMonth1(e: any) {
    this.timeLineService.SetTimeLineRangeFirstMonth(e.target.value);
    let m = new InformationExchange('20001', this.timeLineService.Data);
    this.messageService.sendMessage(m);
  }

  OnChangeFromDay1(e: any) {
    this.timeLineService.SetTimeLineRangeFirstDay(e.target.value);
    let m = new InformationExchange('20001', this.timeLineService.Data);
    this.messageService.sendMessage(m);
  }

  OnChangeFromYear2(e: any) {
    this.timeLineService.SetTimeLineRangeFinalYear(e.target.value);
    let m = new InformationExchange('20001', this.timeLineService.Data);
    this.messageService.sendMessage(m);
  }

  OnChangeFromMonth2(e: any) {
    this.timeLineService.SetTimeLineRangeFinalMonth(e.target.value);
    let m = new InformationExchange('20001', this.timeLineService.Data);
    this.messageService.sendMessage(m);
  }

  OnChangeFromDay2(e: any) {
    this.timeLineService.SetTimeLineRangeFinalDay(e.target.value);
    let m = new InformationExchange('20001', this.timeLineService.Data);
    this.messageService.sendMessage(m);
  }

  OnChangeDateYear(e: any) {
    this._year = e.target.value;
  }

  OnChangeDateMonth(e: any) {
    this._month = e.target.value;
  }

  OnChangeDateDay(e: any) {
    this._day = e.target.value;
  }

  private Date(offset: number): Date {
    //if (!this.canvasService.ExternalDataExchange) {
    //  return new Date();
    //}
    return this.canvasService.getExternalDataExchange('timelinedata').Data[offset] as Date;
  }

  private Year(date: Date): string {
    return date.getFullYear().toString();
  }

  private Month(date: Date): string {
    let m = date.getMonth() + 1;
    return m.toString();
  }

  private Day(date: Date): string {
    return date.getDate().toString();
  }

  get timeLineRangeYear() {
    return this.Year(this.Date(2));
  }

  get timeLineRangeMonth() {
    return this.Month(this.Date(2));
  }

  get timeLineRangeDay() {
    return this.Day(this.Date(2));
  }

  get timeLineRangeFirstYear() {
    return this.Year(this.Date(0));
  }

  get timeLineRangeFirstMonth() {
    return this.Month(this.Date(0));
  }

  get timeLineRangeFirstDay() {
    return this.Day(this.Date(0));
  }

  get timeLineRangeFinalYear() {
    return this.Year(this.Date(1));
  }

  get timeLineRangeFinalNonth() {
    return this.Month(this.Date(1));
  }

  get timeLineRangeFinalDay() {
    return this.Day(this.Date(1));
  }




}
