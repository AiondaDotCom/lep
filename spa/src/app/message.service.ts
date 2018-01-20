import { Injectable } from '@angular/core';

interface Message {
  type: string;
  message: string;
}

@Injectable()
export class MessageService {

  messages: Message[];

  constructor() {
    this.messages = [];
  }

  message(msg: Message): void {
    console.log(`Message: ${msg.type}, ${msg.message}`);
    console.log(this.messages)
    this.messages.push(msg);
  }

  delete(msg: Message): void {
    console.log(`Deleting message: ${msg.message}`);
    let msgID = this.messages.findIndex((object) => {
      return (object === msg);
    })
    this.messages.splice(msgID, 1);
  }

  get lastMessage(): Message {
    return this.messages[this.messages.length-1];
  }

}