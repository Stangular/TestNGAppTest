import { Injectable, Inject } from '@angular/core';
import {
  Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

//import { IElementDefinition } from '../UI/model/ElementDefinition';
//import { FormGroup } from '@angular/forms';
//import 'rxjs/add/operator/map';
//mport 'rxjs/add/operator/catch';
import { map, catchError } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { IForm } from '../model/form/form';
import { TokenService } from '../../app/services/user/token/token.service';

@Injectable()
export class DataHTTPService {

   private _options: RequestOptions;
  private _headers: HttpHeaders = new HttpHeaders();

  private _startupData: any;
  constructor(
    private http: HttpClient,
    private tokenService: TokenService) { }

  public InitializeOptions(userToken: string) {
    this._headers = new HttpHeaders();
    this._headers.set('Content-Type', 'application/json');
    this._headers.set('Accept', 'application/json');

    const requestOptions = {
      params: new HttpParams()
    };
    //https://stackoverflow.com/questions/45797513/angular4-http-httpclient-requestoptions
    //https://www.techiediaries.com/angular-by-example-httpclient-get/

  //    this._options = new RequestOptions({ headers: this._headers });
  //    this._options.params.set()
  }

   httpOptions(params: HttpParams) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.tokenService.Token || ''
      })
    };
    return httpOptions;
  }

  private processData(res: any) {
    //this._records.

    return res || {}; //TODO: Need an 'Empty records type' for || error state.
  }

  protected handleError(error: Response) {
    // ErrorManager.HandleError(error);
    return error.statusText;
  }

  getContent(filter: any, restPath: string = 'https://localhost:44336/api/data/GetFilteredContent'): Observable<IForm> {
    let f: any = { formName: 'charttestTableA', paging: { pageLength: 4, pageNumber: 1 }, filters: [{ FieldId: 'income', Sort: 2, Value: 0, Operation: 0 }] };
    this._headers.set('Content-Type', 'application/json');
    this._headers.set('Accept', 'application/json');

    let myParams = new HttpParams();
    myParams.set('filter', f);
   // let options = new RequestOptions({ headers: this._headers, params: myParams });

    let self = this;
    return this.http.get(restPath, this.httpOptions(myParams))
      .pipe(map(response => this.processData(response), catchError(this.handleError)));
  }

  startUpPromise(restPath: string): Promise<any> {
    this._startupData = null;
    return this.http.get(restPath)
      .pipe(map(response => response, catchError(this.handleError))).toPromise()
      .then((data: any) => this._startupData = data);
  }

  get startupData(): any {
    return this._startupData;
  }

  postContent(content: any, restPath: string = 'https://localhost:44336/api/data'): Observable<IForm> {
    return this.http.post(
      restPath, 
      content,
      this.httpOptions(new HttpParams()))
      .pipe(map(response =>
        this.processData(response),
        catchError(this.handleError)));
  }

  updateContent(content: any, restPath: string = 'https://localhost:44336/api/data'): Observable<IForm> {
    return this.http.put(
      restPath, content)
      .pipe(map(response =>
        this.processData(response),
        catchError(this.handleError)));
  }

  deleteContent(content: any, restPath: string = 'https://localhost:44336/api/data/DeletePost'): Observable<IForm> {

    return this.http.post(
      restPath, content)
      .pipe(map(response =>
        this.processData(response),
        catchError(this.handleError)));
  }
}
