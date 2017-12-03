import {Injectable} from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from "rxjs";
import {Message} from "../../models/message";

@Injectable()
export class ChatService {

    private messages = new BehaviorSubject<Message[]>([]);
    messages$ = this.messages.asObservable();

    addMessage(message){
        this.messages.getValue().push(message);
    }

    giveMessages(messages: Message[]){
        this.messages.next(messages);
    }

    getMessages(){
        const body = {};
        return this.post("get",body);
    }

    getMessageById(id){
        const body = {message_id:id};
        return this.post("get/message",body);
    }

    getProjectMessages(project_id){
        const body = {project_id:project_id};
        return this.post("get/project",body);
    }

    send(receiver,message){
        const body = {receiver:receiver,message:message};
        return this.post("send",body);
    }

    sendToProject(project_id,message){
        const body = {project_id:project_id,message:message};
        return this.post("send/project",body);
    }


    private post(url,body){
        body.token = localStorage.getItem("token");
        body = JSON.stringify(body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post("chat/"+url, body, {headers: headers})
            .map(response => response.json())
            .catch(this.handleError);
    }

    constructor(private http: Http) {
    }


    private handleError (error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}