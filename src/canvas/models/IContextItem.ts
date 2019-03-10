import { Point } from "./shapes/primitives/point";
import { ShapeSelectResult } from "./shapes/shapeSelected";


export interface IContextItem {

  Id: string;
  Draw(context: any): void;
  SelectShape(shapeSelectResult: ShapeSelectResult): boolean;
}

export interface IContextSystem extends IContextItem {
  Content: IContextItem[];
  AddContent(content: IContextItem);
  RemoveContent(id: string): boolean;
  SelectShape(shapeSelectResult: ShapeSelectResult): boolean;
}

export class ContextLayer implements IContextSystem {
  constructor(
    private id: string,
    private displayState: string,
    protected content: IContextItem[] = []) { }

  get Id() { return this.id; }
  
  Draw(context: any) {
    this.content.forEach(function (item, i) { item.Draw(context); });
  }

  get Content(): IContextItem[] { return this.content; }

  SelectContent(index: number) {
    if (index > 0) {
      if (index >= this.content.length) {
        index = this.content.length - 1;
      }
      const c = this.content[index];
      this.content.splice(index, 1);
      this.content.unshift(c);
      return true;
    }
    return false;
  }

  SelectContentById(contentId: string) {
    this.SelectContent(this.content.findIndex(c => c.Id === contentId));
  }

  AddContent(content: IContextItem) {
    this.content.push(content);
  }

  RemoveAllContent() {
    while (this.RemoveContent());
  }

  RemoveContent(): boolean {
    if (this.content.length <= 0) { return false;}
    this.content.splice(0, 1);
    return true;
  };


  //RemoveContentById(contentId: string): boolean {
  //  return (this.SelectContentById(contentId)) ? this.RemoveContent() : false;
  //}

  SelectShape(shapeSelectResult: ShapeSelectResult): boolean{
    let bRes = false;
    this.content.forEach(function (item, i) {
      if (!bRes) {
        bRes = item.SelectShape(shapeSelectResult);
      }
    });
    return bRes;
  }
}

export class ContextSystem implements IContextSystem{


  constructor( private layers: ContextLayer [] = []) { }

  get Id() { return this.layers[0].Id; }

  Draw(context: any ) {
    this.layers.reverse().forEach(l => l.Draw(context));
  }

  get Content(): IContextItem[] { return this.layers[0].Content; }

  AddContent(content: IContextItem) { this.layers[0].AddContent(content); }

  RemoveContent(id: string): boolean {
    return this.layers[0].RemoveContent();
  };

  AddLayer(id: string, displayState: string, content: IContextItem[] = []) {
    this.layers.unshift(new ContextLayer(id, displayState, content));
 //   this.Draw();
  }

  SelectLayer(index: number) {
    if (index > 0) {
      if (index >= this.layers.length) {
        index = this.layers.length - 1;
      }
      const layer = this.layers[index];
      this.layers.splice(index, 1);
      this.layers.unshift(layer);
      return true;
    }
    return false;
  }

  Clear() {
    this.layers.forEach(function (l, i) { l.RemoveAllContent(); });   
  }

  SelectLayerById(layerId: string) {
    return this.SelectLayer(this.layers.findIndex(l => l.Id === layerId));
  }

  SelectShape(shapeSelectResult: ShapeSelectResult): boolean{
    let bRes = false;
    this.layers.forEach(function (l, i) {
      if (!bRes) {
        bRes = l.SelectShape(shapeSelectResult);
     }
    });
    return bRes;
  }
}
