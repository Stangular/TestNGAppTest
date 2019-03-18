import { Injectable } from '@angular/core';
import { LayoutManager, LayoutPattern, ColumnModel } from './models/columnModel';

//{
//  providedIn: 'root'
//}
@Injectable()
export class LayoutService {

  private layout: LayoutManager = new LayoutManager();
  constructor() { }

  getPatternIndex(name: string) {
    return this.layout.getLayoutIndex(name);
  }

  getLayoutColumnCount(index: number) {
    return this.layout.getLayoutColumnCount(index);
  }

  getLayoutRowHeight(index: number): string {
    let hgt = this.layout.getLayoutRowHeight(index) || 0;
    return hgt.toString() + 'px';
  }

  Columns(index: number) {
    return this.layout.Columns(index);
  }

  ColSpan(index: number, tile: number) {
    return this.layout.ColSpan(index, tile);
  }

  RowSpan(index: number, tile: number) {
    return this.layout.RowSpan(index, tile);
  }

  get Layout() {
    return this.layout;
  }
}
