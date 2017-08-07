import {Component, ViewChild} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {TaskService} from "../../_services/task.service";
import {Title} from "@angular/platform-browser";
import {Task} from "../../../models/task";
import {MdGridList} from "@angular/material";
import { ObservableMedia } from "@angular/flex-layout";
import {Profile} from "../../../models/profile";
import {ProfileService} from "../../_services/profile.service";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';

@Component({
    selector: 'webapp-view-task',
    templateUrl: './viewtask.component.html',
    styleUrls: ['./viewtask.component.css'],
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
export class ViewTaskComponent {

    @ViewChild('grid')
    private grid: MdGridList;
    @ViewChild('description') descriptionTile;
    @ViewChild('taskName') taskName;

    lastUpdated;

    canEdit:boolean = false;
    canComplete:boolean=false;

    profile:Profile;
    profileSubscriptions:Subscription  =  this.profileService.profile$.subscribe(
        profile => {
            this.profile = profile;

        }
    );
    task:Task=null;
    taskSubscription:Subscription = this.taskService.task$.subscribe(
        task=>{
                this.task = task;
                this.task.name = this.capitalizeName(this.task.name);
                this.titleService.setTitle(this.task.name+"'s tasks");
                //TODO: here should be called comments service
        }
    );

    constructor(private taskService: TaskService,private titleService: Title,private media: ObservableMedia,private profileService:ProfileService){
        (this.task.assigner_email.match(this.profile.email))? this.canEdit = true : this.canEdit=false ;
        (this.task.assignee_email.find(x => x == this.profile.email))? this.canComplete=true:this.canComplete=false;
        let temp = new Date().getTime() - new Date(this.task.date_created).getTime();
        this.lastUpdated = new Date(temp).getMinutes();
    }

    ngOnDestroy(){
        this.taskSubscription.unsubscribe();
    }

    ngAfterViewInit(){
        this.updateGrid();
        this.media.subscribe(change => { this.updateGrid(); });
    }

    completeTask(){
        let temp = new Date();
        this.taskService.complete(this.task).subscribe(
            res => {
                this.task.completed = !this.task.completed;
                let temp2 = new Date().getTime() - temp.getTime();
                this.lastUpdated = new Date(temp2).getMinutes();
            }
        );
    }

    capitalizeName(name:String){
        return name.replace(/\b(\w)/g, s => s.toUpperCase());
    }

    updateGrid(): void {
        if (this.media.isActive('xl')) { this.grid.cols = 5; }
        else if (this.media.isActive('lg')) { this.grid.cols = 4; }
        else if (this.media.isActive('md')) { this.grid.cols = 3; this.descriptionTile.colspan=2; }
        else if (this.media.isActive('sm')) { this.grid.cols = 2; this.descriptionTile.colspan=2; }
        else if (this.media.isActive('xs')) { this.grid.cols = 1; this.descriptionTile.colspan=1; }
    }
}