import {Component, OnInit} from "@angular/core";
import {Project} from "../../../models/project";
import {ProjectService} from "../../_services/projects.service";
import {Subscription} from "rxjs";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'webapp-project-dashboard',
    templateUrl: './project_dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class ProjectDashboardComponent implements OnInit{

    private project:Project;
    subscription:Subscription = this.projectService.project$.subscribe(
        project => {
                this.project = project;
                this.titleService.setTitle(this.project.name+" Project Dashboard");
        }
    );

    constructor(private projectService:ProjectService,private titleService:Title){
    }

    ngOnInit(){

    }
    ngOnDestroy(){
        if(this.subscription!==undefined)
        this.subscription.unsubscribe();
        this.titleService.setTitle("Project Management");
    }
}