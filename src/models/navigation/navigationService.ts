import { Injectable } from '@angular/core';
import { NavigationLink } from "./navigationLink";
import { Router } from '@angular/router';


@Injectable()
export class NavigationService {
  private _home: NavigationLink;
  private _selectedItem: NavigationLink;

  constructor() {
    this._home = new NavigationLink('Home', '', '/home');
    this.AddTo(new NavigationLink("NAS", '', '/NAS'), 'home');
    this.AddTo(new NavigationLink("Lost Cause", '', '/Lost_Cause'), 'home');
    this.AddTo(new NavigationLink("DNA Segments", '', '/DNA_Segments'), 'home');
   this._selectedItem = this._home;
  }

  AddTo(link: NavigationLink, parentName: string = '') {
    let item = this.FindItem(link.Name, this._home);
    if (item) {
      return;
    }
    this.FindItem(parentName, this._home)
    let l = this.FindItem(parentName, this._home) || this._home;
    if (l) {
      l.AddLink(link);
    }
  }

  public get SelectedItem() {
    return this._selectedItem;
  }

  public Back(router: Router) {
    this.UnselectAll(this._home);
    let selection = this.FindParent();
    if (selection) {
      this._selectedItem = selection;
    }
    this._selectedItem.Go(router);
    return this._selectedItem;
  }

  get Home() {
    return this._home;
  }

  get Path() {
    let path = [];
    this.PathToSelectedItem(this._home, path);
    return path;
  }

  get SiteMap() {
    let map = [];
    this.AllItems(this._home, map);
    return map;
  }

  private AllItems(item: NavigationLink, path: NavigationLink[]) {
    let self = this;
    item.SubLinks.forEach(function (n, i) {
      self.AllItems(n, path);
    });
    path.unshift(item);
  }

  private PathToSelectedItem(item: NavigationLink, path: NavigationLink[]) {
    let self = this;
    let result = false;
    if (item.Name == this._selectedItem.Name) { return true; }
    item.SubLinks.forEach(function (n, i) {
      if (self.PathToSelectedItem(n, path)) {
        path.unshift(item);
        result = true;
      }
    });
    return result;
  }

  public Select(router: Router, item: NavigationLink, startFrom: NavigationLink = null) {
    this.SelectByName(router, item.Name, startFrom);
  }
  
  public SelectByName(router: Router, item: string, startFrom: NavigationLink = null) {
    if (startFrom == null) {
      startFrom = this._selectedItem;
    }
    if (!item) { item = this._home.Name; }
    this.UnselectAll(this._home);
    let selection = this.FindItem(item, startFrom) || this._home;
    if (selection) {
      if (selection.HasSubLinks) {
        this._selectedItem = selection;
        this._selectedItem.SubLinks[0].Select();
      }
      selection.Go(router);
    }
  }

  private UnselectAll(nav: NavigationLink) {
    let self = this;
    nav.UnSelect();
    nav.SubLinks.forEach(function (l, i) {
      self.UnselectAll(l);
    });

  }

  private FindItem(itemName: string, nav: NavigationLink = null) {
    if (!nav) { return null; }
    let l = nav.SubLinks.find(n => n.Name == itemName );
    if (!l) {
      for (let i = 0; i < nav.SubLinks.length; i = i + 1) {
        l = this.FindItem(itemName, nav.SubLinks[i]);
        if (l) {
          break;
        }
      }
    }
    return l;
  }

  private FindParent(nav: NavigationLink = null) {
    if (!nav) { nav = this._home; }
    let l = nav.SubLinks.find(n => n.Name == this._selectedItem.Name);
    if (!l) {
      for (let i = 0; i < nav.SubLinks.length; i = i + 1) {
        l = this.FindParent(nav.SubLinks[i]);
        if (l) {
          this._selectedItem = nav.SubLinks[i];
          l = null;
          break;
        }
      }
    }
    else {
      l = this._home;
    }
    return l;
  }
}
