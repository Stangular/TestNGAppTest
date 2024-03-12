import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class InformationExchange {
  constructor(private id: string, private data: any = {}) { }

  get ID() { return this.id; }
  get Data() { return this.data; }
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private subject = new Subject<any>();

  sendMessage(message: InformationExchange) {
    this.subject.next({ info: message });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
