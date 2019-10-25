import { IShape } from '../../IShape';
import { Shape } from '../../shape';
import { IContextItem, ContextSystem } from '../../../IContextItem';
import { DisplayValues, StateIndex, UIStates } from '../../../DisplayValues'
import { Point } from '../../primitives/point';
import { ShapeSelectResult } from '../../shapeSelected';
import { Rectangle } from '../../rectangle';
import { Content } from '../Content';
import { ContextModel } from 'src/canvas/component/context.model';

export class TextShape extends Shape {

  constructor(
    id: string,
    top: number,
    left: number,
    width: number,
    height: number,
    protected content: Content) {
    super(id, top, left, width, height, content.State);
  }

  DrawShape(context: ContextModel): void {
    context.DrawText(this);
  }

  get Content() { return this.content; }

  SizeBy(context: ContextModel, top: number, right: number, bottom: number, left: number) {
    right = left + context.MeasureText(this.content.Content, this.Height, this.StateIndex) + 10;
    super.SizeBy( context,top, right, bottom, left);
  }

  Draw(context: any): void {
    this.DrawShape(context);
  }
  

  CopyShape(newID: string): TextShape {

    return new TextShape(newID,this.Top + 10, this.Left + 10, this.Width, this.Height, this.content);
  }

  CopyItem(newID: string) {
    return this.CopyShape(newID);
  }


  Save(): any {
    
    return {
      Id: this.Id,
      Top: Math.ceil(this.Top),
      Left: Math.ceil(this.Left),
      Width: Math.ceil(this.width),
      Height: Math.ceil(this.height),
      Type: 0,
      CornerRadius: 0,
      Shadow: 0,
      DisplayValueId: '',
      Ports: [],
      Shapes: [],
      Content: {
        Id: this.content.ID,
        Content: this.content.Content,
        Code: this.content.Code,
        ParentShapeId: this.Id,
        DisplayValueId: this.content.State,
        angle: this.content.Angle
      }
    }
  }
}

//export class TextCenter extends TextShape {

//  constructor(id: string,
//    top: number,
//    left: number,
//    width: number,
//    height: number,
//    content: Content) {
//    super(
//      top,
//      left,
//      width,
//      height,
//      content);
//  }

//  //align(context: any) {
//  //  context.textAlign = 'center';
//  //  context.fillText(this.text, this.Width/2, this.Height);
//  //}

//  //CopyShape(newID: string): Shape {

//  //  return new Text(newID, this.Top + 10, this.Left + 10, this.Width, this.Height, this.StateName, this.text, this.angle);
//  //}

//  //CopyItem(newID: string) {
//  //  return this.CopyShape(newID);
//  //}
//}

//export class TextRight extends Text {

//  constructor(id: string,
//    top: number,
//    left: number,
//    width: number,
//    height: number,
//    stateName: string,
//    text: string,
//    angle: number = 0) {
//    super(id,
//      top,
//      left,
//      width,
//      height,
//      stateName,
//      text,
//      angle);
//  }

//  align(context: any) {
//    context.textAlign = 'right';
//    context.fillText(this.text, this.Width, this.Height);
//  }

//  CopyShape(newID: string): Shape {

//    return new Text(newID, this.Top + 10, this.Left + 10, this.Width, this.Height, this.StateName, this.text, this.angle);
//  }

//  CopyItem(newID: string) {
//    return this.CopyShape(newID);
//  }
//}
