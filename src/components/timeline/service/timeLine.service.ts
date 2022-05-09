import { Injectable } from '@angular/core';
import { EventContextLayer } from 'src/canvas/models/IContextItem';
import { TimeLineBaseLayerModel, TimeLineTypes } from 'src/canvas/models/concepts/timelines/timeLineBase.model';
import { Rectangle } from 'src/canvas/models/shapes/rectangle';

@Injectable()
export class TimeLineService {

  constructor() { }

  GetContextLayer(parentArea: Rectangle,id: string): EventContextLayer {
    let result: EventContextLayer = null;
    switch (id.toLowerCase()) {
      case 'timeline-decade': result = new TimeLineBaseLayerModel(parentArea, new Date(), 12, 80, 0, TimeLineTypes.decade); break;
      case 'timeline-century': result = new TimeLineBaseLayerModel(parentArea, new Date(), 12, 80, 0, TimeLineTypes.century); break;
      default: result = new TimeLineBaseLayerModel(parentArea, new Date(), 12, 80, 0, TimeLineTypes.year);
    }


    return result;
  }
}
