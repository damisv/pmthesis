import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";

import {Member, Project} from "../../../models/project";
import {ProjectService} from "../../_services/projects.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Profile} from "../../../models/profile";
import {ProfileService} from "../../_services/profile.service";
import {MdSnackBar} from "@angular/material";
import {Title} from "@angular/platform-browser";
import {TaskService} from "../../_services/task.service";


@Component({
    selector: 'webapp-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit,OnDestroy{
    @ViewChild('tab') tabGroup;
    user:Profile;
    project:Project;
    projects:Project[] = [];
    progress  = [];
    progressF = [];
    position='manager';
    positions=[
        'manager','member'
    ];

    projectsSubscription:Subscription = this.projectService.projects$.subscribe(
        projects => this.projects = projects);
    projectSubscription:Subscription = this.projectService.project$.subscribe(
        project=>{
            this.project = project;
        });
    profileSubscription:Subscription =  this.profileService.profile$.subscribe(
        profile=> {
            this.user = profile;
            //this.titleService.setTitle(this.user.firstName+"'s projects");
        }
    );

    constructor(
        private projectService: ProjectService, private profileService:ProfileService ,
        private router:Router,public snackBar: MdSnackBar,private titleService: Title,private taskService : TaskService) {
    }



    positionSearch(team){
        for(let member of team){
            if(member.email==this.user.email && member.position==this.position){
                return true
            }
        }
        return false;
    }

    openProjectDashboard(index){
        this.projectService.giveProject(this.projects[index]);
        this.router.navigate(['app','project','dashboard']);
    }
    openProjectTeam(index){
        this.projectService.giveProject(this.projects[index]);
        this.router.navigate(['app','project','team']);
    }

    addProject(project:Project){
        this.projects.push(project);
        this.tabGroup.selectedIndex=0;
    }

    editProject(index,name){
        this.projects[index].name = name;
    }

    openSnackBar(message,action,duration){
        this.snackBar.open(message,action,duration);
    }


    ngOnInit(){
        this.titleService.setTitle("My Projects");
        for(let project of this.projects){
            this.taskService.getTasksOfProject(project._id).subscribe(
                tasks => {
                    let tasksArrived=tasks;
                    let percentage=0;
                    if(tasksArrived!==null){
                        for(let task of tasksArrived){
                            if(task.completed){percentage+=1;}
                        }
                        if(percentage!==0){
                            this.progress.push((percentage/tasksArrived.length)*100);
                            this.progressF.push(tasksArrived.length);
                        }else{
                            this.progress.push(0);
                            this.progressF.push(tasksArrived.length);
                        }
                        }else{
                            this.progress.push(0);
                            this.progressF.push(0);
                        }
                    }
            );
        }
    }

    ngOnDestroy(){
        if(this.projectSubscription!==undefined)
        this.projectSubscription.unsubscribe();
        if(this.profileSubscription!==undefined)
        this.profileSubscription.unsubscribe();
        if(this.projectsSubscription!==undefined)
        this.projectsSubscription.unsubscribe();
        this.titleService.setTitle("Project Management");
    }
}