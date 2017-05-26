import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import {NotificationService} from "./_services/notification.service";
import {toArray} from "rxjs/operator/toArray";
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
        this.socket.on('loginSuccessful', function(data){
            notificationService.toast("Success Login","Welcome back! Have a nice day");
            //let arg = Array.from(arguments);
        }.bind(this));
        this.socket.on('loginError', function(){
            notificationService.toast("Error Login","There was an error! sorry for the inconvenience!","error");
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