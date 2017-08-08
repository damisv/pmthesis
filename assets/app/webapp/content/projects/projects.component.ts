import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";

import {Member, Project} from "../../../models/project";
import {ProjectService} from "../../_services/projects.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Profile} from "../../../models/profile";
import {ProfileService} from "../../_services/profile.service";
import {MdPaginator, MdSnackBar} from "@angular/material";
import {Title} from "@angular/platform-browser";
import {TaskService} from "../../_services/task.service";

import { DataSource} from "@angular/cdk"
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';


class ExampleDataSource extends DataSource<any> {


    constructor( private projectService: ProjectService, private _paginator: MdPaginator) {
        super();
        this.projectService.projects$.subscribe(projects=>this.projects=projects);
    }
    projects : Project[];

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Project[]> {
        const displayDataChanges = [
            this.projectService.projects$,
            this._paginator.page
        ];

        return Observable.merge(...displayDataChanges).map(() => {
            const cdata = this.projects.slice();
            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            return cdata.splice(startIndex, this._paginator.pageSize);
        });
    }

    disconnect() { }
}

@Component({
    selector: 'webapp-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css'],
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
export class ProjectsComponent implements OnInit,OnDestroy{
    // Time Ago variables
    projectUpdated:Date;


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

    displayedColumns = ['Name','Budget','Description','Members'];
    dataSource: ExampleDataSource | null;

    @ViewChild(MdPaginator) paginator: MdPaginator;

    projectsSubscription:Subscription = this.projectService.projects$.subscribe(
        projects => {
            this.projects = projects;
            this.projectUpdated = new Date();
        });
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

    constructor(private projectService: ProjectService,
                private profileService:ProfileService ,
                private router:Router,
                public snackBar: MdSnackBar,
                private titleService: Title,
                private taskService : TaskService) {
    }

    positionSearch(team){
        for(let member of team){
            if(member.email==this.user.email && member.position==this.position){
                return true
            }
        }
        return false;
    }

    openProjectDashboard(id){
        let index = this.projects.findIndex(project => project._id == id);
        this.projectService.giveProject(this.projects[index]);
        this.router.navigate(['app','project','dashboard']);
    }

    openProjectTeam(id){
        let index = this.projects.findIndex(project => project._id == id);
        this.projectService.giveProject(this.projects[index]);
        this.router.navigate(['app','project','team']);
    }

    addProject(project:Project){
        this.projects.push(project);
        this.projectService.giveProjects(this.projects);
        this.projectUpdated = new Date();
        this.tabGroup.selectedIndex=0;
    }

    editProject(index,name){
        this.projects[index].name = name;
        this.projectUpdated = new Date();
    }

    openSnackBar(message,action,duration){
        this.snackBar.open(message,action,duration);
    }


    ngOnInit(){
        this.titleService.setTitle("My Projects");

        this.dataSource = new ExampleDataSource(this.projectService,this.paginator);

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