import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {Profile} from "../../models/profile";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class InviteService {

    private profile = new BehaviorSubject<Profile>(new Profile('sss'));

    profile$ = this.profile.asObservable();

    acceptInvite(email,projectID){
        const body = {email:email,projectID:projectID};
        return this.post("accept/projectID",body);
    }

    getMyInvites(email){
        const body = {email:email};
        return this.post("search/email",body);
    }

    inviteMember(email,projectID){
        const body = {email:email,projectID:projectID};
        return this.post("member",body);
    }

    getProjectInvites(projectID){
        const body = {projectID:projectID};
        return this.post("search/projectID",body);
    }

    inviteMembers(invites){
        const body = {invites:invites};
        return this.post("members",body);
    }

    private post(url,body){
        body.token = localStorage.getItem("token");
        body = JSON.stringify(body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post("invite/"+url, body, {headers: headers})
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
