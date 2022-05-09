import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
//import { filter } from '@fortawesome/fontawesome-free-solid';
import { FilterService } from './Services/filter/filter.service';
//import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { LoginComponent } from '../app/login/login.component';
import { UserService } from '../app/user/service/app-user.service';
import { NavigationLink } from 'src/models/navigation/navigationLink';
import { NavigationService } from 'src/models/navigation/navigationService';

//import { } '../dataManagement/'

//import { RouterModule } from '@angular/router';

@Component({
  templateUrl: './NAS_APPPrimaryOutletPage.component.html',
  styleUrls: ['./NAS_APP.css']
})
export class NAS_APPPrimaryOutletPageComponent implements OnInit {

  constructor(private filterService: FilterService
    , public userService: UserService
    , private navService: NavigationService
    , private router: Router) {
    //let links: NavigationLink[] = [];
    //links.push(new NavigationLink("Details", "view_compact", "/systeminventory/detail", 'VBarChart'));
    //links.push(new NavigationLink("Table", "grid_on", "/systeminventory/table", 'VBarChart'));
    //let models1: NavigationModel[] = [];
    //let models2: NavigationModel[] = [];
    //models1.push(new NavigationModel("System Inventory", "", "*", '', links));
    //models2.
    //  this.navModel = new NavigationModel('Home', 'home', '/');
    //this.navService.AddTo(new NavigationLink('MES'), 'NAS');
    //this.navService.AddTo(new NavigationLink('HR'), 'NAS');
    //this.navService.AddTo(new NavigationLink('Employee Swipes Rport'), 'HR');
    //this.navService.AddTo(new NavigationLink('Hot Mill'), 'MES');
    //this.navService.AddTo(new NavigationLink('Production Reports'), 'Hot Mill');
    //this.navService.AddTo(new NavigationLink('HRM Production History'), 'Production Reports');
    //this.navService.AddTo(new NavigationLink('Tools', '', '/systeminventory/detail', 'VBarChart'), 'MES');
    //this.navService.AddTo(new NavigationLink('System Inventory', '', '/systeminventory/detail', 'VBarChart'), 'Tools');
    //this.navService.AddTo(new NavigationLink('VBar Detail', 'view_compact', '/systeminventory/detail', 'VBarChart'), 'System Inventory');
    //this.navService.AddTo(new NavigationLink('VBar Table', 'grid_on', '/systeminventory/table', 'VBarChart'), 'System Inventory');
  }
  pageTitle: string = 'Page Title';

  ngOnInit() {
    this.navService.SelectByName(this.router, "NAS", this.navService.Home);
  }

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
