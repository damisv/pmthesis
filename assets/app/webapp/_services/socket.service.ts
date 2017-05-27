import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import {NotificationService} from "./notification.service";
@Injectable()
export class SocketService {
    socket = null;
    constructor(private notificationService:NotificationService) {
        this.socket = io('http://localhost:3000');
        /*this.socket.on('invite', function(data){
            this.onInvite(data);
        }.bind(this));*/
        this.socket.on('projectCreated', function(data){
            console.log(data);
            notificationService.toast("title","content");
        }.bind(this));
        this.socket.on('loginSuccessful', function(){
            notificationService.toast("Success Login","Welcome back! Have a nice day");
            //let arg = Array.from(arguments);
        }.bind(this));
        this.socket.on('loginError', function(){
            notificationService.toast("Error Login","There was an error! sorry for the inconvenience!","error");
        }.bind(this));
        this.socket.on('Invitation', function(projectName){
            notificationService.toast("Congratulations!","You have a new invite for "+projectName,"info",undefined,['app','invites']);
        }.bind(this));
        this.socket.on('connected', function(){
            this.register();
        }.bind(this));
        this.socket.on('memberJoined', function(projectName,email){
            notificationService.toast(email+" joined project "+projectName,"A new member joined "+projectName,"info");
        }.bind(this))
    }

    register(){
        this.socket.emit('register',localStorage.getItem("token"))
    }

    /*
    onInvite(data){
        //getProjectInvites}
    */
}