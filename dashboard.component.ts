import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {ProfileService} from "../../_services/profile.service";
import {Profile} from "../../../models/profile";
import {Subscription} from "rxjs/Subscription";
import {TaskService} from "../../_services/task.service";
import {Router} from "@angular/router";
import {ProjectService} from "../../_services/projects.service";
import {Project} from "../../../models/project";
import {Task} from "../../../models/task";

@Component({
    selector: 'webapp-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

    profile:Profile;
    subscription:Subscription  = this.profileService.profile$.subscribe(
        profile => {
            this.profile = profile;
            //this.titleService.setTitle(this.profile.firstName+"'s Dashboard");
        }
    );

    projects:Project[];
    projectSubscription:Subscription = this.projectService.projects$.subscribe(
        projects =>{
            this.projects = projects;
        }
    );

    tasks:Task[];

    constructor(private profileService: ProfileService,
                private titleService: Title,
                private projectService:ProjectService,
                private router:Router,
                private taskService:TaskService){
    }

    ngOnInit(){
        this.titleService.setTitle("My Dashboard");
        this.taskService.get().subscribe(
            res => {
                this.tasks = res.tasks;
            }
        );
    }

    openProjectDashboard(index){
        this.projectService.giveProject(this.projects[index]);
        this.router.navigate(['app','project','dashboard']);
    }

    openTaskView(index){
        this.taskService.giveTask(this.tasks[index]);
        this.router.navigate(['app','project','taskview']);
    }

    ngOnDestroy(){
        if(this.subscription!==undefined)
            this.subscription.unsubscribe();
        if(this.projectSubscription!==undefined)
            this.projectSubscription.unsubscribe();
        this.titleService.setTitle("Project Management");
    }
}