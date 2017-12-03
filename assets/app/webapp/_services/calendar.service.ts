import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class CalendarService{

    private myEvents = new BehaviorSubject<any>(null);
    myEvents$ = this.myEvents.asObservable();

    private projectEvents = new BehaviorSubject<any>(null);
    projectEvents$ = this.projectEvents.asObservable();

    private teamEvents = new BehaviorSubject<any>(null);
    teamEvents$ = this.teamEvents.asObservable();

    constructor(private http:Http){}

    getMyEvents(){
        const body = {};
        return this.post("myEvents",body);
    }

    getProjectEvents(projectID){
        const body = {id: projectID};
        return this.post("projectEvents",body);
    }

    getTeamEvents(teamID){
        const body = {id: teamID};
        return this.post("teamEvents",body);
    }

    scheduleMyEvent(event){
        event.actions = [];
        const body = {event:event};
        return this.post("myEvents/schedule",body);
    }

    updateMyEvent(event){
        event.actions = [];
        const body = {event:event};
        return this.post("myEvents/update",body);
    }

    deleteMyEvent(event){
        event.actions = [];
        const body = {event:event};
        return this.post("myEvents/delete",body);
    }

    scheduleProjectEvent(event,projectID){
        const body = {
            id: projectID,
            event:event
        };
        return this.post("projectEvents/schedule",body);
    }

    scheduleTeamEvent(teamID,event){
        const body = {
            id: teamID,
            event:event
        };
        return this.post("teamEvents/schedule",body);
    }


    private post(url,body){
        body.token = localStorage.getItem("token");
        body = JSON.stringify(body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post("calendar/"+url, body, {headers: headers})
            .map(response => response.json())
            .catch(this.handleError);
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