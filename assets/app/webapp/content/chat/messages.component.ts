import {Component, Input} from "@angular/core";

@Component({
    selector: 'webapp-chat-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent {

    @Input() user;
    messages = ['How are you man','Tralalalalal','Tralalalalal','adfknajdgnjasg'];

    constructor(){}

    sendMessage(message){
        this.messages.push(message);
    }
}