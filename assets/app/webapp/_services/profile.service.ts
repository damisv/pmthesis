import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {Profile} from "../../models/profile";
import {BehaviorSubject, Subject} from "rxjs";
import {toArray} from "rxjs/operator/toArray";
import {error} from "util";
import {ProgressBarService} from "./progressbar.service";

@Injectable()
export class ProfileService {

    /*initProfile(id:String){
        this.getProfile(id).subscribe(
            profile=>{
                this.giveProfile(profile);
            }
        );
    }*/
    private profile = new BehaviorSubject<Profile>(new Profile('sss'));

    profile$ = this.profile.asObservable();

    giveProfile(profile:Profile){
        this.progressBarService.availableProgress();
        this.profile.next(profile);
        this.progressBarService.availableProgress();
    }

    edit(profile:Profile){
        this.progressBarService.availableProgress();
        const body = {profile:profile};
        return this.post("edit",body);
    }

    getOtherProfile(email){
        this.progressBarService.availableProgress();
        const body = {email:email};
        return this.post("search/email",body);
    }

    getProfile(){
        this.post("get",{}).subscribe(
            res=>{
                this.giveProfile(res.profile);
            },
            error=>{
                console.log(error);
            }
        )
    }


    filterEmails(email){
        this.progressBarService.availableProgress();
        const body = {email:email};
        return this.post("filter/email",body);
    }

    userIsRegistered(email){
        this.progressBarService.availableProgress();
        const body = {email:email};
        return this.post("isRegistered/email",body);
    }

    private post(url,body){
        body.token = localStorage.getItem("token");
        body = JSON.stringify(body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post("profile/"+url, body, {headers: headers})
            .map(response => response.json())
            .catch(this.handleError).finally(() => this.progressBarService.availableProgress());
    }

    constructor(private http: Http,private progressBarService: ProgressBarService) {
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
