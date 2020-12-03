import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observer, Observable } from 'rxjs';

export class HttpModel {

  constructor(
    private _http: HttpClient,
    private url: string,
    private token: string = '',
    private headers: HttpHeaders = null) {

    if (!this.headers) {
      if (this.token.length > 0)
        this.headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + this.token
        });
      else {
        this.headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        });
      }
    }
  }

  get(url: string, params: HttpParams): Observable<any> {
    return this._http.get(url, {
      headers: this.headers,
      params: params
    });
  }

  //put(url: string, model: any): Observable<any> {

  //}

  //post(url: string, model: any): Observable<any>{

  //}

  //delete(url: string, data: any): Observable<any> {

  //}

}
