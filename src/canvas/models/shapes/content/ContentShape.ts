import { Shape } from '../shape';
import { Content } from './Content';
import { ContextModel } from 'src/canvas/component/context.model';

export abstract class ContentShape extends Shape {

  constructor(
    id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    state: string,
    protected content: Content) {
    super(id, top, left, width, height, state);
  }

  get Content() {
    return this.content;
  }

}
