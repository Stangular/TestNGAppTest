import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserService } from '../user/service/app-user.service';
import { LayoutService } from '../services/layout/layout-service.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface DialogData {
  email: string, password: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  rForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  @Input() containerLayout: string = "masterA";
  containerIndex: number = -1;
  layoutIndex: number = -1;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private userService: UserService,
    private _formBuilder: FormBuilder,
    public layout: LayoutService) {
    this.rForm = this._formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]/)]]
    });
  }

  ngOnInit() {
    this.layoutIndex = this.layout.getPatternIndex('formA');
    this.containerIndex = this.layout.getPatternIndex(this.containerLayout);
  }

  control(name: string) {
    return this.rForm.controls[name];
  }

  get EMail() {
    return this.control('email').value;
  }

  get Password() {
    return this.control('password').value;
  }

  login() {
    this.userService.Login(this.EMail, this.Password);
  }
}
