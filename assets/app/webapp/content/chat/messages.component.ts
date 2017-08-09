import {Component, Input} from "@angular/core";

@Component({
    selector: 'webapp-chat-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent{
    @Input() project;
    messageInput;

    messages = [
        {
            type:'sent',
            message: 'How are you?',
            date: new Date()
        },
        {
            type: 'received',
            message: 'Im fine you ?',
            date: new Date()
        },
        {
            type:'sent',
            message: 'How are you?',
            date: new Date()
        },
        {
            type:'received',
            message: 'adfgadfgadfgjandfgnadjfngkjadnkgjnadfgnkjadnfgjandfnakjdfngjadnf  akdjfnkajdnfg adkajdnga dfgkjandfg adfgadf' +
            'akdfjnadjfngkadjfngkajdnfgajdnfgkajdnfg adfgnadgnakdjfng adfgandfgkjandfkgjandf gkadfnana dfkgjadnfg agnadkgjnadf gkajdfg' +
            'kjandfgjadnf gkajdnfg akjdfn kadjfn akgn afgn adjf',
            date: new Date()
        },
        {
            type:'sent',
            message: 'How are you?',
            date: new Date()
        },
        {
            type:'sent',
            message: 'How are you?',
            date: new Date()
        },
        {
            type:'received',
            message: 'How are you?',
            date: new Date()
        },
        {
            type:'received',
            message: 'How are you?',
            date: new Date()
        },
        {
            type:'received',
            message: 'How are you?',
            date: new Date()
        }];

    constructor(){}

    ngOnInit(){
    }

    sendMessage(){
        if(this.messageInput==' ' || this.messageInput==null) {
            this.messageInput=null;
            return false;
        }
        let messageTemp={
            type:'sent',
            message:this.messageInput,
            date:new Date()
        };
        this.messages.push(messageTemp);
        this.messageInput=null;
    }

}