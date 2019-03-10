import { Component, OnInit, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
//import { filter } from '@fortawesome/fontawesome-free-solid';
import { FilterService } from './Services/filter/filter.service';
//import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { LoginComponent } from '../app/login/login.component';
import { UserService } from '../app/user/service/app-user.service';
//import { } '../dataManagement/'


@Component({
  templateUrl: './NAS_APPPrimaryOutletPage.component.html',
  styleUrls: ['./NAS_APP.css']
})
export class NAS_APPPrimaryOutletPageComponent implements OnInit {
  constructor(private filterService: FilterService
    , public userService: UserService ) { }
  pageTitle: string = 'Page Title';

  ngOnInit() {}

  Logout() {
    this.userService.Logout();
  }

  login() {
   
    //const dialogConfig = new MatDialogConfig();

    //dialogConfig.disableClose = true;
    //dialogConfig.autoFocus = true;
    //dialogConfig.
    //dialogConfig.data = {
    //  email:'', password:''
    //};

    //const dialogRef = this.dialog.open(LoginComponent, dialogConfig);
    //let self = this;
    //dialogRef.afterClosed().subscribe(result => {
    //  console.log('The login dialog was closed with:' + JSON.stringify(result))
    //  //if ('login' == result.result) {
    //  //  let login = self.userService.Login;
    //  //      this._http.postContent(reginfo, "https://localhost:44306/api/Auth/LoginUser").subscribe(
    //  //data => { this.saveSuccess(data) },
    //  //err => { this.saveFail(err) });
    //    //let model = new EntityRemoveModel();
    //    //model.Id = this.source.GetFieldValue('id');
    //    //model.why = result.why;
    //    //this.httpService.deleteContent(model).subscribe(
    //    //  data => { this.deleteSuccess(data) },
    //    //  err => { this.deleteFail(err) });
    //  }
    //  //   this.httpService.


    //);
  }
}
