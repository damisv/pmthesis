import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
@Injectable()
export class SocketService {
    socket = null;
    price: number = 0.0;
    constructor() {
        this.socket = io('http://localhost:3000');
        this.socket.on('invite', function(data){
            this.onInvite(data);
        }.bind(this));
    }
    register(id:String){
        this.socket.emit('register',id);
    }
    onInvite(data){
        //getProjectInvites
    }
}