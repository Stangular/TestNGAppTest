import { Injectable } from '@angular/core';
import { Path } from '../../lines/path';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { PortService } from './port.service';
import { LineService } from '../../lines/service/line.service';

@Injectable()
export class PathService {

  _paths: Path[] = [];
  _selectedPathName: string;

  constructor(
    private portService: PortService,
    private lineService: LineService) { }

  get Paths(): Path[] {
    return this._paths;
  }

  FilteredPath(id: string) {
    return this.Paths
      .filter(option => option.Id.toLowerCase().indexOf(id) >= 0);
  }

  public AddPath(pathName: string, lineName: string) {
    this._paths.push(new Path(pathName, lineName));
  }

  SetPaths(paths: Path[]) {
    this._paths = paths.concat([]);
  }

  public Filter(value: string): Path[] {

    const v = value.toLowerCase().trim();
    if (v.length <= 0) { return []; }
    this._selectedPathName = value.trim();
    return this.FilteredPath(v);

  }
}

export class ObservableItem<T> {
  controlName = new FormControl();
  selectedName: string = '';
  items: Observable<T[]>;


}

