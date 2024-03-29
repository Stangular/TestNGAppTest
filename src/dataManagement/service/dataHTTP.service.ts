import { Injectable, Inject } from '@angular/core';
import {
  Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

//import { IElementDefinition } from '../UI/model/ElementDefinition';
//import { FormGroup } from '@angular/forms';
//import 'rxjs/add/operator/map';
//mport 'rxjs/add/operator/catch';
import { map, catchError, take, concatMap } from 'rxjs/operators';
import { Observable, Subject, forkJoin, from, of, Observer } from 'rxjs';
import { IForm } from '../model/form/form';
import { TokenService } from '../../app/user/token/token.service';
import { IUploadedFile } from 'src/ui/components/views/form/dialogs/upload/IUpload.model';

const INVALID_FILE = ' Invalid file.';
const INVALID_IMAGE = ' Invalid image.';
const INVALID_SIZE = ' Invalid Size.';

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

  getCombined(paths: string[]) {
    let self = this;
    let obs: Observable<any>[] = [];
    paths.forEach(function (p, i) {
      obs.push(self.getContent(null, p));
    });
    return forkJoin(obs);
  }

  getContent(filter: any, restPath: string = "https://localhost:44393/api/place"): Observable<any> {
  //  let f: any = { formName: 'charttestTableA', paging: { pageLength: 4, pageNumber: 1 }, filters: [{ FieldId: 'income', Sort: 2, Value: 0, Operation: 0 }] };
    this._headers.set('Content-Type', 'application/json');
    this._headers.set('Accept', 'application/json');

    //let myParams = new HttpParams()
    //  .set('id', "110")
    //  .set('name','bob');
    
   // myParams.set('schoolId', "23434");
   // myParams.append('schoolId', "345345");
   // let options = new RequestOptions({ headers: this._headers, params: myParams });

    let self = this;
    return this.http.get(restPath, {})
      .pipe(map(response =>
        self.processData(response),
        catchError(self.handleError)));
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

  StreamData(file: File): Observable<IForm> {
    const formData = new FormData();
    formData.append('file', file);
 //   let content: any = { file: formData, form: { SourceName: 'sss', FormName: 'sss' } };
    let url = 'https://localhost:44336/api/data/StreamDataFile';
    return this.http.post(
      url, formData)
      .pipe(map(response =>
        this.processData(response),
        catchError(this.handleError)));
    //this.httpOptions(new HttpParams()))
    //.pipe(map(response =>
    //  this.processData(response),
    //  catchError(this.handleError)));
  }
  updateContent(content: any, restPath: string = 'https://localhost:44336/api/data'): Observable<IForm> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
  //  let cnt = { value: "adfaf" };
    return this.http.put(
      restPath, content,
      httpOptions)
      .pipe(map(response =>
        this.processData(response),
        catchError(this.handleError)));
  }

  deleteContent(content: any, restPath: string = 'https://localhost:44336/api/data'): Observable<IForm> {
    restPath += '/' + content.Id + '/' + content.why + '/' + content.FormName;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
    return this.http.delete(
      restPath
      , httpOptions)
      .pipe(map(response =>
        this.processData(response),
        catchError(this.handleError)));
  }

  //https://medium.com/@danielimalmeida/creating-a-file-upload-component-with-angular-and-rxjs-c1781c5bdee
  uploadFiles(event): void {
   // const files = event?.target?.files;  need typescript !3.7 for this!
    const files = event && event.target && event.target.files || [];
    const numberOfFiles = files.length;
    from(files)
      .pipe(
        concatMap((file: File) => this.validateFile(file).pipe(catchError((error: IUploadedFile) => of(error)))),
        take(numberOfFiles)
      )
      .subscribe((validatedFile: IUploadedFile) => {
     //   this.uploadedFiles.emit(validatedFile);
      });
  }
  
  //https://medium.com/@danielimalmeida/creating-a-file-upload-component-with-angular-and-rxjs-c1781c5bdee
  private validateFile(file: File): Observable<IUploadedFile> {
    const fileReader = new FileReader();
    const { type, name } = file;
    return new Observable((observer: Observer<IUploadedFile>) => {
      this.validateSize(file, observer);
      fileReader.readAsDataURL(file);
      fileReader.onload = event => {
        if (this.isImage(type)) {
          const image = new Image();
          image.onload = () => {
            observer.next({ file });
            observer.complete();
          };
          image.onerror = () => {
            observer.error({ error: { name, errorMessage: INVALID_IMAGE } });
          };
          image.src = fileReader.result as string;
        } else {
          observer.next({ file });
          observer.complete();
        }
      };
      fileReader.onerror = () => {
        observer.error({ error: { name, errorMessage: INVALID_FILE } });
      };
    });
  }

  private isImage(mimeType: string): boolean {
    return mimeType.match(/image\/*/) !== null;
  }

  private validateSize(file: File, observer: Observer<IUploadedFile>): void {
    const { name, size } = file;
    if (!this.isValidSize(size)) {
      observer.error({ error: { name, errorMessage: INVALID_SIZE } });
    }
  }

  private isValidSize(size: number): boolean {
    const toKByte = size / 1024;
    return toKByte >= 5 && toKByte <= 5120;
  }
}
