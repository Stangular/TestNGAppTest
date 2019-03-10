import { PagingMode } from "../../form.component";

export class PageModel {

  mode: PagingMode = PagingMode.byRecord;
  formDirty: boolean = false;
  recordCount: number = 0;
  pageCount: number = 0;
  recordNumber: number = 0;
  pageNumber: number = 0;
  pageSize: number = 0;
  pageSizeModel: number = 10;

  constructor() {

    
  }

}
