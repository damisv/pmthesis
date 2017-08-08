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
import {NotificationService} from "../../_services/notification.service";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';

@Component({
    selector: 'webapp-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    animations: [ trigger('homeTransition', [
        transition(':enter', [
            query('.card', style({ opacity: 0 })),
            query('.card', stagger(300, [
                style({ transform: 'translateY(100px)' }),
                animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(0px)', opacity: 1})),
            ])),
        ]),
        transition(':leave', [
            query('.card', stagger(300, [
                style({ transform: 'translateY(0px)', opacity: 1 }),
                animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(100px)', opacity: 0})),
            ])),
        ])
    ]) ],
    host: {
        '[@homeTransition]': ''
    }
})
export class DashboardComponent implements OnInit{

    /*
    Time Ago variables
     */
    projectUpdated:Date;
    tasksUpdated:Date;


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
            this.projectUpdated = new Date();
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
                this.tasksUpdated = new Date();
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

    isManager(team){
        for(let member of team){
            if(this.profile.email==member.email && member.position=="manager"){
                return true;
            }
        }
        return false;
    }
    isMember(team){
        for(let member of team){
            if(member.email==this.profile.email && member.position=="member"){
                return true;
            }
        }
        return false;
    }
    ngOnDestroy(){
        if(this.subscription!==undefined)
            this.subscription.unsubscribe();
        if(this.projectSubscription!==undefined)
            this.projectSubscription.unsubscribe();
        this.titleService.setTitle("Project Management");
    }
}