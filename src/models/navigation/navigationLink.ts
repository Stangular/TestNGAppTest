import { Router } from '@angular/router';

export class NavigationLink {
  private _selected: boolean = false;
  private _hasSubLinks: boolean = false;
  private _level: number = 0;

  constructor(
    private _name: string,
    private _icon: string = '',
    private _url: string = '',
    private _data: string = '',
    private _sublinks: NavigationLink[] = [],
    private _bgColorDefault = 'transparent',
    private _fgColorDefault = '#FFFFFF',
    private _bgColorSelected = '#A8A8A844',
    private _fgColorSelected = '#FFFFFF') {
    this._hasSubLinks = this._sublinks.length > 0;
    }

  get Name() { return this._name; }
  get Icon() { return this._icon; }
  get URL() { return this._url; }
  get Data() { return this._data; }

  Go(router: Router) {
    this._selected = false;
    let self = this;
    if (this.Data.length > 0) {
      router.navigate([this.URL, this.Data])
        .then((v) => {
          self._selected = self._hasSubLinks;
        })
        .catch(error => {
          self._selected = false;
        });
    }
    else {
      router.navigate([this.URL])
      .then((v) => { 
          self._selected = self._hasSubLinks;
      })
      .catch(error => { 
          self._selected = false; });
    }
  }

  AddLink(link: NavigationLink) {
    this._sublinks.push(link);
    link.SetLevel(this);
    this._hasSubLinks = true;
  }

  SetLevel(parent: NavigationLink) {
    this._level = parent.Level + 1;
  }

  get Level() {
    return this._level;
  }

  get HasSubLinks() {
    return this._hasSubLinks;
  }

  get SubLinks() { 
    return this._sublinks; 
  }

  Select() {
    return this._selected = true;
  }

  Selected() {
    return this._selected;
  }

  UnSelect() {
    this._selected = false;
  }

  get BGColorSelected() {
    return this._bgColorSelected;
  }

  get FGColorSelected() {
    return this._fgColorSelected;
  }

  get BGColorDefault() {
    return this._bgColorDefault;
  }

  get FGColorDefault() {
    return this._fgColorDefault;
  }
}
