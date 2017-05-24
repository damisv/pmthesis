import {Component, OnInit, ViewChild} from "@angular/core";
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

@Component({
    selector: 'webapp-project-tasks',
    templateUrl: './project_tasks.component.html',
    styleUrls: ['./project_tasks.component.css']
})
export class ProjectTasksComponent implements OnInit{
    @ViewChild('tab') tabGroup;
    user:Profile;
    project:Project;
    tasks:Task[] = [];
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

    selectedOption;
    filterStatus:string = 'all';

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

    completeTask(state:boolean,index:number){
        this.taskService.complete(this.tasks[index]).subscribe(
            res => {
                this.tasks[index].completed= !this.tasks[index].completed;
            }
        );
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

    addTask(task:Task){
        this.tasks.push(task);
        this.tabGroup.selectedIndex='0';
    }

    onEmailClicked(email){
        const configProfile = new MdDialogConfig();
        configProfile.data = email;
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

    }

    ngOnDestroy(){
        if(this.projectSubscriptions!==undefined)
        this.projectSubscriptions.unsubscribe();
        if(this.profileSubscriptions!==undefined)
        this.profileSubscriptions.unsubscribe();
        this.titleService.setTitle("Project Management");
    }


}