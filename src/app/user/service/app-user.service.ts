import { Injectable, Inject } from '@angular/core';
import { UserModel, LoginModel } from './user.model';
import { Router } from '@angular/router';
import { DataHTTPService } from '../../../dataManagement/service/dataHTTP.service';
//import { Observable, Subject } from 'rxjs';
import { TokenService } from '../token/token.service';
import * as moment from 'moment';

@Injectable()
export class UserService {
  //private subject = new Subject<any>();
  private userModel: UserModel = new UserModel();
  private loginModel: LoginModel = new LoginModel();
  constructor(
    private _http: DataHTTPService,
    private tokenService: TokenService,
    private router: Router) {
    this.RecoverUser();
  }

  RecoverUser() {
    let u = window.localStorage.getItem('user');
    if (u) {
      this.userModel = JSON.parse(u);
      let m1 = moment();
      let m2 = moment(this.userModel.expiration);
      if (m1 > m2) {
        this.userModel.token = '';
      }
      this.tokenService.Token = this.userModel.token;
    }
  }

  SetUser(model: any) {
    if (model) {
      this.userModel = model;
      window.localStorage.setItem('user', JSON.stringify(this.userModel));
      this.tokenService.Token = this.userModel.token;
    }
  }

  loginSuccess(data: any) {
    if (data.status[0] == 'success') {
      this.SetUser(data.model);
      this.router.navigate(['/']);
   }
  }

  loginFail(data: any) {
    console.error("log in failed: " + JSON.stringify(data));
  }

  logoutSuccess(data: any) {
    if (data.status[0] == 'success') {
      this.SetUser(data.model);
      this.router.navigate(['/login']);
    }
    else {
      this.SetUser(new UserModel());

    }
  }

  logoutFail(data: any) {
    console.error("log out failed: " + JSON.stringify(data));
    this.SetUser(new UserModel());
    this.router.navigate(['/login']);
  }

  Logout() {

    this._http.postContent(null, "https://localhost:44336/api/Token/Logout").subscribe(
      data => { this.logoutSuccess(data) },
      err => { this.logoutFail(err) });
  }

  Login(email: string, password: string) {
    const reginfo = {
      Email: email,
      Password: password
    }
    this._http.postContent(reginfo, "https://localhost:44336/api/Token").subscribe(
      data => { this.loginSuccess(data) },
      err => { this.loginFail(err) });
  }

  get UserName(): string {
    return this.userModel.username;
  }

  get Token(): string {
    return this.userModel.token;
  }

  get isLoggedIn(): boolean {
    return this.userModel.token.length > 0;
  }

  SetLogin(username: string, password: string) {
    this.loginModel.username = username;
    this.loginModel.password = password;
  }

  get LoginInfo() {
    return this.loginModel;
  }
}
