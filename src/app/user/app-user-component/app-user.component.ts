import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/app-user.service';

@Component({
  selector: 'app-user-component',
  templateUrl: './app-user.component.html',
  styleUrls: ['./app-user.component.css']
})
export class AppUserComponent implements OnInit {

  constructor( public userService: UserService ) { }

  ngOnInit() { }

  Logout() {
    this.userService.Logout();
  }

}
