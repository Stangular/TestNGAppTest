
export class DisplayValueModel {
  DisplayValueId: string = '';
  BGColor: string = '';
  FGColor: string = '';
  Weight: number = 1;
  Font: string = '';
}

export class LineModel {
  LineId: string = '';
  DisplayValueId: string = '';
  LineType: number = 0;
  OffsetX1: number = 0.0;
  OffsetY1: number = 0.0;
  OffsetX2: number = 0.0;
  OffsetY2: number = 0.0;
}

export class PathModel {
  PathId: string = '';
  LineId: string = '';
}

export class PortModel {
  PortId: string = '';
  OffsetX: number = 0.0;
  OffsetY: number = 0.0;
  ShapeId: string = '';
  PathId: string = '';
}

export class ShapeModel {
  Id: string = '';
  Width: number = 0;
  Height: number = 0;
  Type: number = 0;
  CornerRadius: number = 0;
  Shadow: number = 0;
  DisplayValueId: string = '';
  Ports: PortModel[] = [];
}

export class GraphicsModel {
  UnitCellId: string = '00000000-0000-0000-0000-000000000000';
  UnitCellName: string = '';
  displayValues: DisplayValueModel[] = [];
  lines: LineModel[] = [];
  paths: PathModel[] = [];
  shapes: ShapeModel[] = [];
  ports: PortModel[] = [];
}
