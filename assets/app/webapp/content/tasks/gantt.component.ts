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
                     let todayTemp = new Date();
                     todayTemp.setUTCMinutes(0);
                     todayTemp.setUTCSeconds(0);
                     todayTemp.setUTCMilliseconds(0);
                     let min = todayTemp.getTime();
                     let max = 0;
                     if(tasks.length>0) {
                         for(let task of tasks){
                             try{
                                 let tempMin = this.getCorrectDays(task.date_start);
                                 if(tempMin<min) min = tempMin;
                                 let tempMax = this.getCorrectDays(task.date_end);
                                 if(tempMax>max) max = tempMax;
                             }catch (e){
                                 console.log(e);
                             }
                             let dependency;
                             if(task.dependencies.length>0){
                                 dependency = task.dependencies.map(function(dependency){ return [dependency.taskID]}).join();
                             }else{
                                 dependency = null;
                             }
                             tempData.push({
                                 taskName: task.name,
                                 id: task._id,
                                 start: this.getCorrectDays(task.date_start),
                                 end: this.getCorrectDays(task.date_end),
                                 dependency: dependency
                             });
                         }

                         this.dataSeries.push({
                             name: this.project.name,
                             data: tempData
                         });
                         console.log('max = ',new Date(max));
                         let day = 1000 * 60 * 60 * 24;
                         this.initHighGantt(min,max+2*day);
                     }
                 });
             }
         });

    }

    ngAfterViewInit(){
    }


    getCorrectDays(date){
        let dateTemp = new Date(date);
        dateTemp.setUTCHours(0);
        dateTemp.setUTCMinutes(0);
        dateTemp.setUTCSeconds(0);
        dateTemp.setUTCMilliseconds(0);
        return dateTemp.getTime();
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

        console.log(min,' == ',new Date(min));
        console.log('today ',today);
        console.log(max, ' == ', new Date(max));
        console.log('second ',today + 15*day);

        Highcharts.ganttChart('ganttChartContainer', {
            title: {
                text: this.project.name+'\'s Tasks'
            },
            xAxis: {
                currentDateIndicator: true,
                min: min,
                max: max
            },
            series: this.dataSeries,
            responsive:{
                rules:[{
                    condition: {
                        maxWidth: 200,
                        maxHeight: 250
                    },
                    chartOptions:{
                        legend:{
                            enabled:false
                        }
                    }
                }]
            }
        });
    }


    ngOnDestroy(){

    }

}