import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import {NotificationService} from "./notification.service";
import {TaskService} from "./task.service";
import {ChatService} from "./chat.service";
@Injectable()
export class SocketService {
    socket = null;
    constructor(private notificationService:NotificationService,private taskService:TaskService,private chatService:ChatService) {
        this.socket = io('localhost:3000');
        //this.socket = io('https://pmthesis.herokuapp.com');
        /*this.socket.on('invite', function(data){
            this.onInvite(data);
        }.bind(this));*/
        this.socket.on('projectCreated', function(data){
            notificationService.toast("title","content");
        }.bind(this));
        this.socket.on('loginSuccessful', function(){
            //notificationService.toast("Success Login","Welcome back! Have a nice day");
            //let arg = Array.from(arguments);
        }.bind(this));
        this.socket.on('loginError', function(){
            notificationService.create( "error","Error Login","There was an error! sorry for the inconvenience!","error");
        }.bind(this));
        this.socket.on('Invitation', function(projectName){
            notificationService.create("invite","Congratulations!","You have a new invite for "+projectName,"info",undefined,['app','invites']);
        }.bind(this));
        this.socket.on('connected', function(){
            this.register();
        }.bind(this));
        this.socket.on('memberJoined', function(projectName,email){
            notificationService.create("memberJoined",email+" joined project "+projectName,"A new member joined "+projectName,"info");
        }.bind(this));
        this.socket.on('reconnecting', function(){
            //notificationService.create("error","Reconnecting...","Connection with server has been lost!","error",{timeOut:3000});
        }.bind(this));
        this.socket.on('taskAssigned', function(projectName,task){
            let email = localStorage.getItem('lastLogged');
            if(task.assignee_email.indexOf(email)>-1){
                notificationService.create("myTask","You have a new task.",task.name+" has been assigned to you!","info",{timeOut:3000},['app','project','tasks']);//todo click -> taskView
            }
            taskService.giveTaskArrived(task);
        }.bind(this));
        this.socket.on('projectMessage', function(id){
            notificationService.create("You have a new message.","Read here!","info",{timeOut:3000},['app','project','chat']);//todo click -> chat
            /*chatService.getMessageById(id).subscribe(res=>{
                chatService.addMessages(res.messages);
            });*/
        }.bind(this));
    }

    register(){
        this.socket.emit('register',localStorage.getItem("token"))
    }

    ngOnDestroy(){
        if(this.socket!==null){
            this.socket.close();
        }
    }
    /*
    onInvite(data){
        //getProjectInvites}
    */
}