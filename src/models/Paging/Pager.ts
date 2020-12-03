import { IPager } from '../Interface/IPager';

export class Pager implements IPager {

  constructor(private total: number,private page = 0,private pageSize: number = 16) {}
  Page(): number { return this.page; }
  PageSize(): number { return this.pageSize; }

  PageCount(): number { return this.ItemCount() / this.PageSize(); }
  ItemCount(): number { return this.total }

  First(): number { return this.Goto(0);}
  Final(): number { return this.Goto(this.PageCount() - 1); }

  Next(): number { return this.Step(1); }
  Back(): number { return this.Step(-1); }

  Step(by: number): number { return this.Goto(this.Page() + by); }
  Goto(page: number): number {
    if (page < 0) { this.page = 0; }
    else if (page >= this.PageCount()) { this.page = this.PageCount() - 1; }
    else { this.page = page; }
    return this.page;
  };
  
}
