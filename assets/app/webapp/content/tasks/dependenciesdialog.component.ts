import {Component, OnInit, Inject, Optional} from "@angular/core";
import {MD_DIALOG_DATA,MdDialogRef} from "@angular/material";
import {Router} from "@angular/router";
import {TaskService} from "../../_services/task.service";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector:'error-dialog',
    template: `
        <h1 md-dialog-title></h1>
        <div md-dialog-content>
            <table border="1px">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Task Name</th>
                        <th>Assignees</th>
                        <th>Early Start</th>
                        <th>Early End</th>
                    </tr>
                </thead>
                <tbody>
                
                    <tr *ngFor="let task of tasks;let i=index">
                        <td>
                            <md-select  name="dependencyType" placeholder="Dependency Type" floatPlaceholder="never" (change)="onDependencySelected($event.value,i)">
                                <md-option *ngFor="let dependency of dependencyStandards"  [value]="dependency.value">
                                    {{dependency.viewValue}}
                                </md-option>
                            </md-select>
                        </td>
                        <td>{{task.name}}</td>
                        <td mdTooltip="{{task?.assignee_email}}" >{{ task.assignee_email?.length }}</td>
                        <td>{{task?.date_start | date}}</td>
                        <td>{{task?.date_end | date}}</td>
                    </tr>
               
                    
                </tbody>
            </table>
        </div>
        <div md-dialog-actions>
            <button md-button [md-dialog-close]="dependencies">Close</button>
        </div>
    `
})
export class DependenciesDialogComponent implements OnInit{

    tasks=[];
    dependencies=[];
    dependencyStandards = [
        {value:'fts',viewValue:'Finish-To-Start'},
        {value:'sts',viewValue:'Start-to-Start'},
        {value:'ftf',viewValue:'Finish-to-Finish'},
        {value:'stf',viewValue:'Start-to-Finish'},
        {value:'none',viewValue:'None'}
        ];

    constructor(
        @Optional() @Inject(MD_DIALOG_DATA) private dialogData: any,
        public dialogRef: MdDialogRef<DependenciesDialogComponent>
    ) {}

    onDependencySelected(type,index) {
        this.dependencies[index].type=type;
    }


    ngOnInit(){
        this.tasks = this.dialogData;
        for(let task of this.tasks){
            this.dependencies.push({taskID:task._id,name:task.name,type:'none'})
        }
    }
}