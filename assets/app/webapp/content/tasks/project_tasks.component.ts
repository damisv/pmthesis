import {Component, ComponentRef, OnInit, ViewChild} from "@angular/core";
import {ProjectService} from "../../_services/projects.service";
import {Profile} from "../../../models/profile";
import {Task} from "../../../models/task";
import {Subscription} from "rxjs";
import {ProfileService} from "../../_services/profile.service";
import {Project} from "../../../models/project";
import {MdDialog, MdDialogConfig} from "@angular/material";
import {ProfileDialogComponent} from "../user/profiledialog.component";
import {Title} from "@angular/platform-browser";
import {TaskService} from "../../_services/task.service";
import {Router} from "@angular/router";
import {CreateTaskComponent} from "./create_task.component";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';

@Component({
    selector: 'webapp-project-tasks',
    templateUrl: './project_tasks.component.html',
    styleUrls: ['./project_tasks.component.css'],
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
export class ProjectTasksComponent implements OnInit{
    @ViewChild('tab') tabGroup;
    user:Profile;
    project:Project;
    tasks:Task[] = [];
    task:Task;
    projectSubscriptions:Subscription = this.projectService.project$.subscribe(
        project=>{
            this.project = project;
            this.titleService.setTitle(this.project.name+"'s tasks");
            this.getTasksOfProject();
        }
    );
    profileSubscriptions:Subscription  =  this.profileService.profile$.subscribe(
        profile=>this.user = profile
    );
    taskSubscriptions:Subscription  =  this.taskService.taskArrived$.subscribe(
        task=>{
            if(task.project_id===this.project._id){
                this.task = task;
                this.tasks.push(task);
            }
        }
    );

    selectedOption;
    filterStatus:string = 'all';
    @ViewChild(CreateTaskComponent) childCmpRef:ComponentRef<CreateTaskComponent>;

    constructor(
        private projectService: ProjectService,
        private profileService: ProfileService,
        public dialog: MdDialog,
        private titleService: Title,
        private taskService:TaskService,
        private router: Router) {
    }

    createNewTask(){
        this.tabGroup.selectedIndex='2';
    }

    hasRightToCompleteTask(assigner,assignee){
        if(assigner.match(this.user.email)){
            return true;
        }else if(assignee.indexOf(this.user.email)>-1){
            return true;
        }
        return false;
    }

    completeTask(state:boolean,index:number){
        if(this.hasRightToCompleteTask(this.tasks[index].assigner_email,this.tasks[index].assignee_email)){
            this.taskService.complete(this.tasks[index]).subscribe(
                res => {
                    this.tasks[index].completed= !this.tasks[index].completed;
                }
            );
        }
    }

    checkStatus(index:number):boolean{
        if(this.filterStatus=='all'){
            return true;
        }else if(this.filterStatus=='closed'){
            return this.tasks[index].completed == true;
        }else{
            return this.tasks[index].completed == false;
        }
    }

    addTask(){
        this.tabGroup.selectedIndex='1';
    }


    onEmailClicked(email){
        const configProfile = new MdDialogConfig();
        configProfile.data = email;
        configProfile.width = '50%';
        configProfile.height = '30%';
        let dialogProfile = this.dialog.open(ProfileDialogComponent,configProfile);
        dialogProfile.afterClosed().subscribe(result => {
            this.selectedOption = result;
        });
    }

    getTasksOfProject(){
        this.taskService.getTasksOfProject(this.project._id).subscribe(
            tasks => {
                this.tasks = [];
                for (let task of tasks) {
                    this.tasks.push(task);
                }
            },
            error => console.error(error)
        );
    }

    openTaskView(index){
        this.taskService.giveTask(this.tasks[index]);
        this.router.navigate(['app','project','taskview']);
    }

    ngOnInit(){
        this.getTasksOfProject()
    }

    ngOnDestroy(){
        if(this.projectSubscriptions!==undefined)
        this.projectSubscriptions.unsubscribe();
        if(this.profileSubscriptions!==undefined)
        this.profileSubscriptions.unsubscribe();
        if(this.taskSubscriptions!==undefined)
            this.taskSubscriptions.unsubscribe();
        this.titleService.setTitle("Project Management");
    }


}