import { NgModule } from '@angular/core';
import { UserLoginLibComponent } from './user-login-lib.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { Dir } from '@angular/cdk/bidi';

@NgModule({
  imports: [
  ],
  declarations: [UserLoginLibComponent, UserLoginComponent],
  exports: [UserLoginLibComponent]
})
export class UserLoginLibModule { }
Dir
