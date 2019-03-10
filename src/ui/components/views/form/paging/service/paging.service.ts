import { Injectable } from '@angular/core';
import { PageModel } from './paging-model';

@Injectable()
export class PagingService {

  public model: PageModel = new PageModel();

  constructor() { }


}
