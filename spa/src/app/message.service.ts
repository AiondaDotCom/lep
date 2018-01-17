import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {

  constructor() { }

  message(message: string): void {
    console.log(`Message: ${message}`)
  }

}
