//https://medium.com/@danielimalmeida/creating-a-file-upload-component-with-angular-and-rxjs-c1781c5bdee
export interface IUploadedFile {
  file?: File;
  error?: IUploadError;
}

export interface IUploadError {
  name: string;
  errorMessage: string;
}
