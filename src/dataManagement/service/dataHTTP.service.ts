import { Injectable, Inject } from '@angular/core';
//import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

//import { IElementDefinition } from '../UI/model/ElementDefinition';
//import { FormGroup } from '@angular/forms';
//import 'rxjs/add/operator/map';
//mport 'rxjs/add/operator/catch';
import { map, catchError } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { IForm } from '../model/form/form';

@Injectable()
export class DataHTTPService {

  // private _options: RequestOptions;
  private _headers: Headers = new Headers();

  private _startupData: any;
  constructor(private http: HttpClient) { }

  public InitializeOptions(userToken: string) {
    this._headers = new Headers({
      'Authorization': 'bearer ' + userToken,
      'Content-Type': 'application/json; charset=utf-8'
    });
    const requestOptions = {
      params: new HttpParams()
    };
    //https://stackoverflow.com/questions/45797513/angular4-http-httpclient-requestoptions
    //   this._options = new RequestOptions({ headers: this._headers });
    //   this._options.params.set()
  }

  private processData(res: any) {
    //this._records.

    return res || {}; //TODO: Need an 'Empty records type' for || error state.
  }

  protected handleError(error: Response) {
    // ErrorManager.HandleError(error);
    return error.statusText;
  }

  getContent(formName: string, restPath: string = 'http://localhost:52462/api/data'): Observable<IForm> {
    return this.http.get(restPath + '/' + formName)
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

  postContent(content: any, restPath: string = 'http://localhost:52462/api/data'): Observable<IForm> {
    return this.http.post(
      restPath
      , content)
      .pipe(map(response =>
        this.processData(response),
        catchError(this.handleError)));
  }

  updateContent(content: any, restPath: string = 'http://localhost:52462/api/data'): Observable<IForm> {
    return this.http.put(
      restPath, content)
      .pipe(map(response =>
        this.processData(response),
        catchError(this.handleError)));
  }

  deleteContent(content: any, restPath: string = 'http://localhost:52462/api/data/DeletePost'): Observable<IForm> {

    return this.http.post(
      restPath, content)
      .pipe(map(response =>
        this.processData(response),
        catchError(this.handleError)));
  }
}
