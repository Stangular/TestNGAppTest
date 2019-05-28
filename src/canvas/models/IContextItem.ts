import { Injectable } from '@angular/core';
import { Point } from "./shapes/primitives/point";
import { Size } from "./shapes/primitives/size";
import { ShapeSelectResult } from "./shapes/shapeSelected";
import { Shape } from "./shapes/shape";
import { forEach } from "@angular/router/src/utils/collection";
import { Line } from './lines/line';
import { Port } from './shapes/port';


export interface IContextItem {

  Id: string;
  Class: string;
  AssignToClass(clss: string): void;
  Draw(context: any): void;
  Select(criteria: any): boolean;
  CopyItem(newId: string): IContextItem;
  UpdateContextState(): void;
}

export interface IContextSystem {
  Content: IContextItem[];
  AddContent(content: IContextItem);
  RemoveContent(): IContextItem;
  RemoveContentById(id: string): IContextItem;
  RemoveAllContent();
  Draw(context: any): void;
  CopyItem(itemId: string, newId: string) : string;
}

export class ContextLayer implements IContextSystem {
  constructor(
    private id: string,
    private displayState: string,
    protected content: IContextItem[] = []) { }

  get Id() { return this.id; }

  Draw(context: any) {
    this.content.forEach(function (item, i) { item.Draw(context); });
    // ports
    // lines
  }

  get Content(): IContextItem[] { return this.content; }

  UpdateContextState() {
    this.content.forEach(function (c, i) {
      c.UpdateContextState();
    });
  }

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

  RemoveContent(): IContextItem {
    if (this.content.length <= 0) { return null; }
    let item = this.content[0];
    this.content.splice(0, 1);
    return item;
  };

  RemoveContentById(id: string): IContextItem {
    if (this.content.length <= 0) { return null; }
    let ndx = this.content.findIndex(c => c.Id == id);
    if (ndx < 0) { return null; }
    let item = this.content[ndx];
    this.content.splice(ndx, 1);
    return item;
  };

  CopyItem(itemId: string, newId: string = '') : string {
    let ndx = this.content.findIndex(c => c.Id == itemId);
    if (ndx < 0) { return ''; }
    if (newId.length <= 0) { newId = itemId + '_' + this.content.length; }
    this.AddContent(this.content[ndx].CopyItem(newId));
    return newId;
  }
  //RemoveContentById(contentId: string): boolean {
  //  return (this.SelectContentById(contentId)) ? this.RemoveContent() : false;
  //}

  Select(shapeSelectResult: ShapeSelectResult): boolean {
    let bRes = false;
    this.content.forEach(function (item, i) {
      if (!bRes) {
        bRes = item.Select(shapeSelectResult);
      }
    });
    return bRes;
  }
}

export class PortLayer implements IContextSystem {

  constructor(
    private id: string,
    private displayState: string,
    protected content: IContextItem[] = []) { }

  get Id() { return this.id; }

  Draw(context: any) {
    this.content.forEach(function (item, i) { item.Draw(context); });
    // ports
    // lines
  }

  get Content(): IContextItem[] { return this.content; }

  AddContent(content: Port) {
    this.content.push(content);
  }

  RemoveAllContent() {
    while (this.RemoveContent());
  }

  RemoveContent(): IContextItem {
    if (this.content.length <= 0) { return null; }
    let item = this.content[0];
    this.content.splice(0, 1);
    return item;
  };

  RemoveContentById(id: string): IContextItem {
    if (this.content.length <= 0) { return null; }
    let ndx = this.content.findIndex(c => c.Id == id);
    if (ndx < 0) { return null; }
    let item = this.content[ndx];
    this.content.splice(ndx, 1);
    return item;
  };

  CopyItem(itemId: string, newId: string = ''): string {
    let ndx = this.content.findIndex(c => c.Id == itemId);
    if (ndx < 0) { return ''; }
    if (newId.length <= 0) { newId = itemId + '_' + this.content.length; }
    this.AddContent(this.content[ndx].CopyItem(newId));
    return newId;
  }
}

export class LineLayer implements IContextSystem {
  constructor(
    private id: string,
    private displayState: string,
    protected content: IContextItem[] = []) { }

  get Id() { return this.id; }

  Draw(context: any) {
    this.content.forEach(function (item, i) { item.Draw(context); });
    // ports
    // lines
  }

  get Content(): IContextItem[] { return this.content; }

  AddContent(content: Line) {
    this.content.push(content);
  }

  RemoveAllContent() {
    while (this.RemoveContent());
  }

  RemoveContent(): IContextItem {
    if (this.content.length <= 0) { return null; }
    let item = this.content[0];
    this.content.splice(0, 1);
    return item;
  };

  RemoveContentById(id: string): IContextItem {
    if (this.content.length <= 0) { return null; }
    let ndx = this.content.findIndex(c => c.Id == id);
    if (ndx < 0) { return null; }
    let item = this.content[ndx];
    this.content.splice(ndx, 1);
    return item;
  };

  CopyItem(itemId: string, newId: string = ''): string {
    let ndx = this.content.findIndex(c => c.Id == itemId);
    if (ndx < 0) { return ''; }
    if (newId.length <= 0) { newId = itemId + '_' + this.content.length; }
    this.AddContent(this.content[ndx].CopyItem(newId));
    return newId;
  }
}

//export class ActionLayer implements IContextSystem {// uses separate context
//}
// manages context layers...
export class ContextSystem implements IContextSystem { 

  // ports;
  // lines;
  constructor(private layers: ContextLayer[] = []) { }

  get Id() { return this.layers[0].Id; }

  Draw(context: any) {
    this.layers.reverse().forEach(l => l.Draw(context));
  }

  get Content(): IContextItem[] { return this.layers[0].Content; }

  AddContent(content: IContextItem) { this.layers[0].AddContent(content); }

  RemoveContent(): IContextItem {
    return this.layers[0].RemoveContent();
  };

  RemoveAllContent() {
    return this.layers[0].RemoveAllContent();
  }

  RemoveContentById(id: string) {
    return this.layers[0].RemoveContentById(id);
  }

  CopyItem(itemId: string, newId: string = '') : string {
    return this.layers[0].CopyItem(itemId, newId);
  }

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

  Select(shapeSelectResult: ShapeSelectResult): boolean {
    let bRes = false;
    this.layers.forEach(function (l, i) {
      if (!bRes) {
        bRes = l.Select(shapeSelectResult);
      }
    });
    return bRes;
  }
}

@Injectable()
export class ContextService {

  constructor(contextSystem: ContextSystem) {}

}
