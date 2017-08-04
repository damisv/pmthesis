import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {Task} from "../../models/task";
import {BehaviorSubject} from "rxjs";
import {ProgressBarService} from "./progressbar.service";
import {Subject} from "rxjs/Subject";

@Injectable()
export class TaskService {


    private task = new BehaviorSubject<Task>(new Task('projectid','project_name','assigner','name'));
    task$ = this.task.asObservable();

    private taskArrived = new Subject<Task>();
    taskArrived$ = this.taskArrived.asObservable();

    giveTaskArrived(task: Task){
        this.progressBarService.availableProgress();
        this.taskArrived.next(task);
        this.progressBarService.availableProgress();
    }

    getTasksOfProject(projectID){
        this.progressBarService.availableProgress();
        const body = {projectID:projectID};
        return this.post("search/projectID",body);
    }

    create(task){
        this.progressBarService.availableProgress();
        const body = {task:task};
        return this.post("create",body);
    }

    giveTask(task: Task){
        this.progressBarService.availableProgress();
        this.task.next(task);
        this.progressBarService.availableProgress();
    }

    get(){
        this.progressBarService.availableProgress();
        return this.post("get",{});
    }

    complete(task){
        this.progressBarService.availableProgress();
        const body = {task:task};
        return this.post("complete",body);
    }

    private post(url,body){
        body.token = localStorage.getItem("token");
        body = JSON.stringify(body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post("task/"+url, body, {headers: headers})
            .map(response => response.json()
            )
            .catch(this.handleError).finally(()=> this.progressBarService.availableProgress());
    }

    constructor(private http: Http,private progressBarService:ProgressBarService) {
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
