import { ContentLayer } from '../content/content.layer';
import { BarLayer } from '../content/bars/bar.layer';
import { Margin } from '../../../../shapes/primitives/margin';
import { Size } from '../../../../shapes/primitives/size';

export class ContentFactory {

  static getContent(contentID: string) {
    let content: ContentLayer;

    //switch (contentID) {
    //  case 'bar': content = new BarLayer(); break;
    //  default: content = new BarLayer(); break;
    //}
    return content;
      
  }
}
