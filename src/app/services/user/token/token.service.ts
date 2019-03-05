import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {
  private token: string = '';
  constructor() { }

  set Token(token: string) {
    this.token = token;
  }

  get Token() {
    return this.token;
  }
}
