import { Injectable } from '@angular/core';

interface Message {
  type: string;
  message: string;
}

@Injectable()
export class MessageService {

  messages: Message[];

  constructor() {
    this.clear();
  }

  success(msg: string): void {
    this.message({
      type: 'success',
      message: msg
    })
  }

  error(msg: string): void {
    this.message({
      type: 'danger',
      message: msg
    })
  }

  message(msg: Message): void {
    this.clear()
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

  clear(): void{
    this.messages = [];
  }

  get lastMessage(): Message {
    return this.messages[this.messages.length-1];
  }

}
