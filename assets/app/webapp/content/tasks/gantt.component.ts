import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {TaskService} from "../../_services/task.service";
import {Subscription} from "rxjs/Subscription";
import {ProjectService} from "../../_services/projects.service";
import {Project} from "../../../models/project";


declare var Highcharts:any;

@Component({
    selector: 'webapp-project-gantt',
    templateUrl: './gantt.component.html',
    styleUrls: ['./gantt.component.css']
})
export class GanttComponent implements OnInit,AfterViewInit,OnDestroy{


    projectSubscription:Subscription;
    taskSubscription:Subscription;

    project:Project;
    dataSeries=[];


    constructor(private projectService:ProjectService,
                private taskService:TaskService){
    }

    ngOnInit(){
         this.projectSubscription = this.projectService.project$.subscribe(project=>{
             this.project = project;
             if(project._id!== 'test'){
                 this.taskSubscription = this.taskService.getTasksOfProject(this.project._id).subscribe(tasks =>{
                     let tempData = [];
                     if(tasks.length>0) {
                         for(let task of tasks){
                             tempData.push({
                                 taskName: task.name,
                                 id: task._id,
                                 start: new Date(task.date_start).getTime(),
                                 end: new Date(task.date_end).getTime()
                             });
                         }
                         let min = 0;
                         let max = 0;
                         try{
                             min = new Date(tasks[0].date_start).getTime();
                             tasks.forEach(function(task){
                                if(new Date(task.date_end).getTime()>max) max = new Date(task.date_end).getTime();
                             },this);
                         }catch (e){
                             console.log(e);
                         }
                         this.dataSeries.push({
                             name: this.project.name,
                             data: tempData
                         });
                         this.initHighGantt(min,max);
                     }
                 });
             }
         });

    }

    ngAfterViewInit(){

    }


    initHighGantt(min,max){
        let todayTemp = new Date();
        todayTemp.setUTCMinutes(0);
        todayTemp.setUTCSeconds(0);
        todayTemp.setUTCMilliseconds(0);
        let day = 1000 * 60 * 60 * 24;
        let today = todayTemp.getTime();

        if(min<1){
            min = today - 5*day;
        }
        if(max<1){
            max=today+15*day;
        }

        Highcharts.ganttChart('ganttChartContainer', {
            title: {
                text: this.project.name+'\'s Tasks'
            },
            xAxis: {
                currentDateIndicator: false,
                min: min,
                max: max
            },
            series: this.dataSeries
        });
    }


    ngOnDestroy(){

    }

}