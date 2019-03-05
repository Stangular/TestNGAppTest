const small: number = 640;
const medium: number = 1007;
export enum windowSize {
  small = 0,
  medium = 1,
  large = 2
}
export class ColumnModel {

  constructor(
    private colSpan: number[],
    private rowSpan: number[],
    private contentName: string,
    private rowSize: number = 80,
    private color: string = 'transparent') { }

  ColSpan(size: windowSize) {
    return this.colSpan[size];
  }

  RowSpan(size: windowSize) {
    return this.rowSpan[size];
  }

  get Color() {
    return this.color;
  }

  get Content() {
    return this.contentName;
  }

  get RowSize() {
    return this.rowSize;
  }

}

export class LayoutPattern {

  constructor(
    private name: string,
    private columnCount: number[] = [],
    private rowHeight: number[] = [],
    private columns: ColumnModel[] = []) { }

  ColumnCount(size: number) {
    return this.columnCount[size];
  }

  RowHeight(size: number) {
    return this.rowHeight[size];
  }

  get Name(): string {
    return this.name;
  }

  get Columns(): ColumnModel[] {
    return this.columns;
  }

  AddTile(
    colSpan: number[],
    rowSpan: number[],
    contentName: string,
    rowSize: number = 80,
    color: string = 'transparent') {

    this.columns.push(new ColumnModel(colSpan, rowSpan, contentName, rowSize, color));

  }

}

export class LayoutManager {

  size: windowSize = windowSize.large;

  constructor(private patterns: LayoutPattern[] = []) {


    let pattern = new LayoutPattern('base', [1, 2, 3], [40, 220, 68]);
    pattern.AddTile([1, 1, 1], [1, 2, 3], 'slotA', 80, 'yellow');
    pattern.AddTile([1, 1, 1], [1, 2, 3], 'slotB', 80, 'green');
    pattern.AddTile([1, 1, 1], [1, 2, 3], 'slotC', 80, 'red');
    pattern.AddTile([1, 1, 3], [1, 2, 3], 'slotD', 80, 'blue');
    pattern.AddTile([1, 2, 3], [1, 2, 3], 'slotE', 80, '#90acb8');
    this.patterns.push(pattern);

    pattern = new LayoutPattern('baseA', [1, 2, 3], [120, 120, 120]);
    pattern.AddTile([1, 1, 1], [1, 1, 1], 'slotG', 80, '#a1a1b8');
    pattern.AddTile([1, 1, 1], [1, 1, 1], 'slotH', 80, '#a2a1b8');
    pattern.AddTile([1, 1, 1], [1, 1, 1], 'slotI', 80, '#a3a1b8');
    pattern.AddTile([1, 2, 2], [1, 1, 1], 'slotJ', 80, '#a4a1b8');
    this.patterns.push(pattern);

    pattern = new LayoutPattern('formA', [1, 1, 1], [120, 120, 120]);
    pattern.AddTile([1, 1, 1], [1, 1, 1], '', 80, '#a0a1b8');
    pattern.AddTile([1, 1, 1], [1, 1, 1], '', 80, '#a1a1b8');
    pattern.AddTile([1, 1, 1], [1, 1, 1], '', 80, '#a2a1b8');
    pattern.AddTile([1, 1, 1], [1, 1, 1], '', 80, '#a3a1b8');
    pattern.AddTile([1, 1, 1], [1, 1, 1], '', 80, '#a4a1b8');
    this.patterns.push(pattern);

    pattern = new LayoutPattern('masterA', [1, 2,3], [16, 120, 120]);
    pattern.AddTile([1, 1, 1], [3, 2, 1], 'slotA', 180, 'transparent');
    pattern.AddTile([1, 1, 1], [30, 3, 3], 'slotB', 180, 'transparent');
    pattern.AddTile([1, 2, 1], [1, 1, 1], 'slotC', 180, 'transparent');
    this.patterns.push(pattern);
  }

  get Size() {
    return this.size;
  }

  getLayoutIndex(name: string) {
    return this.patterns.findIndex(p => p.Name == name);
  }

  getLayoutColumnCount(index: number) {
    return (index >= 0) ? this.patterns[index].ColumnCount(this.size) : 0;
  }

  getLayoutRowHeight(index: number) {
    return (index >= 0) ? this.patterns[index].RowHeight(this.size) : 120;
  }

  Columns(index: number) {
    return this.patterns[index].Columns;
  }

  ColSpan(index: number, tile: number) {
    return this.patterns[index].Columns[tile].ColSpan(this.size);
  }

  RowSpan(index: number, tile: number) {
    return this.patterns[index].Columns[tile].RowSpan(this.size);
  }

  SetWindowWidth(width: number) {
    if (width <= small) {
      this.size = windowSize.small;
    }
    else if (width <= medium) {
      this.size = windowSize.medium;
    }
    else {
      this.size = windowSize.large;
    }
  }
}
