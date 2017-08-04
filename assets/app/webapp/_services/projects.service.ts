import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {Project} from "../../models/project";
import {BehaviorSubject} from "rxjs";
import {Task} from "../../models/task";
import {ProgressBarService} from "./progressbar.service";
import {ChatService} from "./chat.service";

@Injectable()
export class ProjectService {

    private project = new BehaviorSubject<Project>(new Project('test','test',[]));
    project$ = this.project.asObservable();

    private projects = new BehaviorSubject<Project[]>([]);
    projects$ = this.projects.asObservable();

    giveProjects(projects:Project[]){
        this.initProject(projects);
        this.projects.next(projects);
    }

    initProject(projects){
        for (let project of projects) {
            this.chatService.getProjectMessages(project._id).subscribe(res=>{
                this.chatService.addMessages(res.messages);
            });
            if(localStorage.hasOwnProperty('projectID')){
                if(project._id===localStorage.getItem('projectID')){
                    this.giveProject(project);
                }
            }
        }
    }

    getProject(id){
        this.progressBarService.availableProgress();
        const body = {id:id};
        return this.post("search/id",body);
    }

    giveProject(project:Project){
        localStorage.setItem('projectID', project._id);
        this.project.next(project);
    }

    editProject(project){
        this.progressBarService.availableProgress();
        const body = {project:project};
        return this.post("edit",body);
    }

    createProject(project){
        this.progressBarService.availableProgress();
        const body = {project:project};
        return this.post("create",body);
    }

    getProjects(){
        this.post("get",{}).subscribe(
            res=>{
                this.giveProjects(res.projects);
            },
            error=>{
                console.log(error);
            }
        )
    }

    private post(url,body) {
        body.token = localStorage.getItem("token");
        body = JSON.stringify(body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post("project/"+url, body, {headers: headers})
            .map(response => response.json()).finally(()=> this.progressBarService.availableProgress());
    }

    constructor(private http: Http,private progressBarService: ProgressBarService,private chatService:ChatService) {

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
