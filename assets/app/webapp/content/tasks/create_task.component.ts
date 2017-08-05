import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {Task} from "../../../models/task";
import {ProjectService} from "../../_services/projects.service";
import {Subscription} from "rxjs/Subscription";
import {Project} from "../../../models/project";
import {Profile} from "../../../models/profile";
import {ProfileService} from "../../_services/profile.service";
import { FormControl} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import {MdDialog, MdGridList, MdSnackBar} from "@angular/material";
import {animate, keyframes, state, style, transition, trigger} from "@angular/animations";
import {TaskService} from "../../_services/task.service";
import { ObservableMedia } from "@angular/flex-layout";
import {NotificationService} from "../../_services/notification.service";
import {DependenciesDialogComponent} from "./dependenciesdialog.component";

@Component({
    selector: 'project-create-task',
    templateUrl: './create_task.component.html',
    styleUrls: ['./create_task.component.css'],
    animations :[
        trigger('focusPanel', [
            state('inactive', style({
                transform: 'scale(1)'
            })),
            state('active', style({
                transform: 'scale(1)'
            })),
            transition('inactive => active', animate('100ms ease-in')),
            transition('active => inactive', animate('100ms ease-out'))
        ]),

        trigger('movePanel', [

            transition('void => *', [
                animate(600, keyframes([
                    style({opacity: 0, transform: 'translateY(-10px)', offset: 0}),
                    style({opacity: 1, transform: 'translateY(0px)', offset: .75}),
                    style({opacity: 1, transform: 'translateY(0)', offset: 1}),
                ]))
            ])

        ])

    ]
})
export class CreateTaskComponent implements OnInit{
    @Input() email:String;
    @Output() taskCreated = new EventEmitter<Task>();

    state: string = 'inactive';

    @ViewChild('grid')
    private grid: MdGridList;
    @ViewChild('taskname') tasknameTile;
    @ViewChild('description') descriptionTile;

    toggleMove() {
        this.state = (this.state === 'inactive' ? 'active' : 'inactive');
    }


    task:Task;
    tasks;
    project:Project;
    projectSubscriptions:Subscription  = this.projectService.project$.subscribe(
        project=>{
            this.project = project;

        }
    );
    user:Profile;
    profileSubscriptions:Subscription = this.profileService.profile$.subscribe(
        profile=>{
            this.user = profile;
        }
    );

    assigneeCtrl: FormControl;
    filteredTeam: any;

    taskAssignee='';
    assigned=[];
    team = [];

    dependencies=[];
    result;

    ///
    @ViewChild('form') createTaskForm;
    ///

    constructor (
        private projectService: ProjectService,
        private profileService:ProfileService,
        public snackBar: MdSnackBar,
        private dialog: MdDialog,
        private taskService:TaskService,
        private media: ObservableMedia,
        private notificationService:NotificationService
    ) {
        this.assigneeCtrl = new FormControl();
        this.filteredTeam = this.assigneeCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterTeam(name));
        this.task = new Task(
            this.project._id,
            this.project.name,
            this.user.email,'')
    }

    filterTeam(val: string){
        this.team = [];
        if(this.project.team.length>0){
            for(let member of this.project.team){
                this.team.push(member.email);
            }
        }
        return val ? this.team.filter(s => new RegExp(`^${val}`,'gi').test(s))
            : this.team;
    }

    onSubmit() {
        if(this.task.name===''){
            this.openSnackBar("Please enter a VALID name for this task",'',5000);
            return;
        }
        this.task.dependencies = this.dependencies;
        this.task.assigner_email = this.user.email;
        this.task.assignee_email = this.assigned;
        this.task.project_name = this.project.name;
        this.task.project_id = this.project._id;
        this.task.completed = false;

        this.taskService.create(this.task)
            .subscribe(res => {
                    this.createTaskForm.reset();
                    this.assigned=[];
                    this.dependencies = [];
                    this.taskCreated.emit(res.task);
                    //this.notificationService.create(res.task.name,"Task has been successfully created!","success");
                },
                error =>{
                    this.notificationService.create(this.task.name,"Error! Task was not created!","error");
                }
            );

    }

    onAssigned(){
        let index = this.team.indexOf(this.taskAssignee);
        if(index!=-1){
            this.assigned.push(this.taskAssignee);
            this.team.splice(this.team.indexOf(this.taskAssignee),1);
            this.openSnackBar("User assigned",'',2000);
            this.toggleMove();
        }else{
            this.openSnackBar("There isn't a member such as "+this.taskAssignee+" on this team",'',5000);
        }
        this.taskAssignee=null;
    }

    removeAssignee(email:string){
        this.assigned.splice(this.assigned.indexOf(email),1);
        this.team.push(email);
        this.openSnackBar("Assignee removed",'',2000);
    }

    addDependencies(){
        this.taskService.getTasksOfProject(this.project._id).subscribe( tasks => {
            let dialogError = this.dialog.open(DependenciesDialogComponent,{
                data: tasks
            });
            dialogError.afterClosed().subscribe(result => {
                this.dependencies = this.checkArray(result);
                console.log(this.dependencies);
            });
        });

    }

    checkArray(dependencies){
        let temp = [];
        for(let dependency of dependencies){
            if(dependency.type!=='none'){
                temp.push(dependency);
            }
        }
        return temp;
    }

    openSnackBar(message,action,duration){
        this.snackBar.open(message,action,{duration:duration});
    }

    ngOnInit(){
    }

    ngAfterViewInit(){
        this.updateGrid();
        this.media.subscribe(change => { this.updateGrid(); });
    }

    updateGrid(): void {
        if (this.media.isActive('xl')) { this.grid.cols = 5; }
        else if (this.media.isActive('lg')) { this.grid.cols = 4; }
        else if (this.media.isActive('md')) { this.grid.cols = 3; }
        else if (this.media.isActive('sm')) { this.grid.cols = 2; this.descriptionTile.colspan=2; }
        else if (this.media.isActive('xs')) { this.grid.cols = 1; this.descriptionTile.colspan=1; this.tasknameTile.colspan=1; }
    }

    ngOnDestroy(){
        if(this.projectSubscriptions!==undefined)
        this.projectSubscriptions.unsubscribe();
        if(this.profileSubscriptions!==undefined)
        this.profileSubscriptions.unsubscribe();
    }
}
