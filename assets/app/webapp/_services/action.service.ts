import {Injectable} from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ActionService {

    getProject(projectID){
        const body = {projectID:projectID};
        return this.post("get/project",body);
    }

    create(action){
        const body = {action:action};
        return this.post("create",body);
    }


    private post(url,body){
        body.token = localStorage.getItem("token");
        body = JSON.stringify(body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post("action/"+url, body, {headers: headers})
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