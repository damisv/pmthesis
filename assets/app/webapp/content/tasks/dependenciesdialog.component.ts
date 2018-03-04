import {Component, OnInit, Inject, Optional} from "@angular/core";
import {MAT_DIALOG_DATA,MatDialogRef} from "@angular/material";
import {Router} from "@angular/router";
import {TaskService} from "../../_services/task.service";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector:'error-dialog',
    template: `
        <h1 mat-dialog-title></h1>
        <div mat-dialog-content>
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
                            <mat-select  name="dependencyType" placeholder="Dependency Type" floatPlaceholder="never" (change)="onDependencySelected($event.value,i)">
                                <mat-option *ngFor="let dependency of dependencyStandards"  [value]="dependency.value">
                                    {{dependency.viewValue}}
                                </mat-option>
                            </mat-select>
                        </td>
                        <td>{{task.name}}</td>
                        <td matTooltip="{{task?.assignee_email}}" >{{ task.assignee_email?.length }}</td>
                        <td>{{task?.date_start | date}}</td>
                        <td>{{task?.date_end | date}}</td>
                    </tr>
               
                    
                </tbody>
            </table>
        </div>
        <div mat-dialog-actions>
            <button mat-button [mat-dialog-close]="dependencies">Close</button>
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
        @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
        public dialogRef: MatDialogRef<DependenciesDialogComponent>
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