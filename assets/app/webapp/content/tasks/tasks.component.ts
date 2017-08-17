import {AfterViewInit, Component} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {trigger, stagger, animate, style, query, transition} from '@angular/animations';
import {Subscription} from "rxjs/Subscription";
import {TaskService} from "../../_services/task.service";
import {Project} from "../../../models/project";
import {Task} from "../../../models/task";
import {ProjectService} from "../../_services/projects.service";
import {ProfileService} from "../../_services/profile.service";
import {Profile} from "../../../models/profile";

declare var Highcharts:any;

@Component({
    selector: 'webapp-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.css'],
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
    ])],
    host: {
        '[@homeTransition]': ''
    }
})
export class TasksComponent implements AfterViewInit{

    //Time Ago Variables
    ganttUpdated:Date;


    private dataH = [];
    private profile:Profile;
    profileSubscription:Subscription;
    projectsSubscription:Subscription;

    projects:Project[];
    tasks:Task[] = [];
    tasksSubscription:Subscription;

    titleService = new Title("");
    constructor(private taskService: TaskService,
                private projectService:ProjectService,
                private profileService:ProfileService){}

    ngAfterViewInit(){
        this.tasksSubscription = this.taskService.tasks$.subscribe(
            tasks => {
                this.tasks = tasks;
            });

        this.profileSubscription = this.profileService.profile$.subscribe(
            profile => this.profile = profile
        );
        /*
        Populate Highcharts Series and initiate
         */
        this.projectsSubscription = this.projectService.projects$.subscribe(
            projects => {
                this.projects = projects;
                this.ganttUpdated = new Date();
                for(let project of this.projects){
                    this.taskService.getTasksOfProject(project._id).subscribe((tasks)=> {
                        if(tasks.length>0){
                            this.dataH.push({
                                name: project.name,
                                data : [{
                                    taskName: project.name,
                                    id: project._id
                                }]
                            });
                            let index = this.dataH.findIndex( x => x.name == project.name);
                            for(let task of tasks){
                                if(task.assignee_email.find(x => x == this.profile.email)){
                                    this.dataH[index].data.push({
                                        taskName:task.name,
                                        id: task._id,
                                        parent: project._id,
                                        start: new Date(task.date_start).getTime(),
                                        end: new Date(task.date_end).getTime()
                                    });
                                }
                            }
                        }
                        this.initHighGantt();
                    });
                }
                this.initTasks();
            });
        this.titleService.setTitle("My Tasks");
    }


    initTasks(){
        /*this.taskService.getTasksOfProjects().subscribe(
            res => {
                this.taskService.giveTasks(res.tasks);
            },
            error => console.error(error)
        );*/

    }

    /*
    Highcharts Gantt
     */
    initHighGantt(){
        let todayTemp = new Date();
        todayTemp.setUTCMinutes(0);
        todayTemp.setUTCSeconds(0);
        todayTemp.setUTCMilliseconds(0);

        let day = 1000 * 60 * 60 * 24;
        let today = todayTemp.getTime();

        Highcharts.ganttChart('container', {
            title: {
                text: this.profile.email+'\'s Upcoming Tasks'
            },
            xAxis: {
                currentDateIndicator: true,
                min: today - 3 * day,
                max: today + 18 * day
            },
            series: this.dataH,
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

        })
    }

    daysToMilliseconds(days) {
        return days * 24 * 60 * 60 * 1000;
    }

    ngOnDestroy(){
        if(this.projectsSubscription!==undefined)
            this.projectsSubscription.unsubscribe();
        if(this.tasksSubscription!==undefined)
            this.tasksSubscription.unsubscribe();
        this.titleService.setTitle("Project Management");
    }
}