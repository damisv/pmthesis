import {Component, Input} from "@angular/core";
import {Message} from "../../../models/message";
import {ActivatedRoute} from "@angular/router";
import {ChatService} from "../../_services/chat.service";
import {Subscription} from "rxjs/Subscription";
import {ProfileService} from "../../_services/profile.service";

@Component({
    selector: 'webapp-chat-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent{
    messageInput;
    projectID;
    profile;
    messages:Message[] = [];

    /*messageSubscription:Subscription = this.chatService.messages$.subscribe((messages)=>{
       this.messages = messages;
    });*/
    profileSubscription:Subscription = this.profileService.profile$.subscribe((profile)=>{
        this.profile = profile;
    });

    messagesSubscription:Subscription = this.chatService.messages$.subscribe((messages)=>{
        this.messages = messages;
    });

    constructor(
        private route: ActivatedRoute,
        private chatService:ChatService,
        private profileService:ProfileService){}

    ngOnInit(){
        this.route.params.subscribe((params: {id: string}) => {
            this.projectID = params.id;
            this.chatService.getProjectMessages(params.id).subscribe(res=>{
                if(res.messages.length>0){
                    for(let message of res.messages){
                        if(this.messages.findIndex(
                            function(my_message){
                                return my_message._id == message._id;}) <0)
                        this.messages.push(message);
                    }
                    this.chatService.giveMessages(this.messages);
                }
            });
        });
    }

    sendMessage(){
        if(this.messageInput==' ' || this.messageInput==null) {
            this.messageInput=null;
            return false;
        }
        let messageTemp= new Message('',this.profile.email,this.projectID,this.messageInput,new Date());
        this.chatService.sendToProject(this.projectID,messageTemp).subscribe((result)=>{
            this.messageInput=null;
        });
    }

}