import {Component, ViewChild} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {TaskService} from "../../_services/task.service";
import {Title} from "@angular/platform-browser";
import {Task} from "../../../models/task";
import {MdGridList} from "@angular/material";
import { ObservableMedia } from "@angular/flex-layout";
import {Profile} from "../../../models/profile";


@Component({
    selector: 'webapp-view-task',
    templateUrl: './viewtask.component.html',
    styleUrls: ['./viewtask.component.css']
})
export class ViewTaskComponent {

    @ViewChild('grid')
    private grid: MdGridList;
    @ViewChild('description') descriptionTile;
    @ViewChild('taskName') taskName;


    canEdit:any = null;

    profile:Profile;
    profileSubscription:Subscription = this.taskService.profile$.subscribe(
        profile => this.profile = profile
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

    constructor(private taskService: TaskService,private titleService: Title,private media: ObservableMedia){
    }

    ngOnDestroy(){
        this.taskSubscription.unsubscribe();
    }

    ngAfterViewInit(){
        this.updateGrid();
        this.media.subscribe(change => { this.updateGrid(); });
        (this.task.assigner_email==this.profile.email)? this.canEdit = true : this.canEdit=null ;
        console.log(this.canEdit);
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