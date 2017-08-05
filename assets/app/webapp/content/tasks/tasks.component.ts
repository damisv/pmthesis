import {Component} from "@angular/core";
import { GoogleChartComponent} from '../../_services/googlechart.component';
import {Title} from "@angular/platform-browser";
import {trigger, stagger, animate, style, query, transition} from '@angular/animations';
import {Subscription} from "rxjs/Subscription";
import {TaskService} from "../../_services/task.service";
import {Project} from "../../../models/project";
import {Task} from "../../../models/task";
import {ProjectService} from "../../_services/projects.service";

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
export class TasksComponent extends GoogleChartComponent {

    private options;
    private data;
    private chart;
    projects:Project[];
    tasks:Task[] = [];
    projectsSubscription:Subscription = this.projectService.projects$.subscribe(
        projects => {
            this.projects = projects;
            this.initTasks();
        });
    tasksSubscription:Subscription = this.taskService.tasks$.subscribe(
        tasks => {
            this.tasks = tasks;
        });

    constructor(private taskService: TaskService, private projectService:ProjectService){
        super();
    }

    initTasks(){
        this.taskService.getTasksOfProjects().subscribe(
            res => {
                this.taskService.giveTasks(res.tasks);
            },
            error => console.error(error)
        );

    }

    titleService = new Title("");

    drawGraph(){
        let data = [];
        data.push(['Task ID', 'Task Name', 'Start Date','End Date','Duration','Percent Complete','Dependencies']);
        if(this.tasks.length>0){
            this.tasks.forEach(function(task){
                let dependency;
                if(task.dependencies.length>0){
                    dependency = task.dependencies.map(function(dependency){ return dependency.taskID}).join();
                }else{
                    dependency = null;
                }
                data.push([task._id, task.name, new Date(task.date_start),new Date(task.date_end), this.daysToMilliseconds(1),  100,  dependency]);
            },this);
        }


        this.data = this.createDataTable(data);

        /*
        [
            ['Task ID', 'Task Name', 'Start Date','End Date','Duration','Percent Complete','Dependencies'],
            ['Research', this.tasks[0].name, new Date(2015, 0, 1), new Date(2015, 0, 5), null,  100,  this.tasks[0].dependencies.join()],
            ['Write', 'Write paper', null, new Date(2015, 0, 9), this.daysToMilliseconds(3), 25, 'Research,Outline'],
            ['Cite', 'Create bibliography', null, new Date(2015, 0, 7), this.daysToMilliseconds(1), 20, 'Research'],
            ['Complete', 'Hand in paper', null, new Date(2015, 0, 10), this.daysToMilliseconds(1), 0, 'Cite,Write'],
            ['Outline', 'Outline paper', null, new Date(2015, 0, 6), this.daysToMilliseconds(1), 100, 'Research']
        ]
         */
        this.options = {
            height: 275,
            gantt: {
                criticalPathEnabled: true,
                criticalPathStyle: {
                    stroke: '#e64a19',
                    strokeWidth: 5
                },
                arrow: {
                    angle: 1,
                    width: 5,
                    color: 'green',
                    radius: 0
                }

            }
        };

        this.chart = this.createGanttChart(document.getElementById('chart_div'));
        this.chart.draw(this.data, this.options);

        this.titleService.setTitle("My Tasks");
    }

    daysToMilliseconds(days) {
        return days * 24 * 60 * 60 * 1000;
    }

    onResize(event){
        this.drawGraph();
    }

    ngOnDestroy(){
        if(this.projectsSubscription!==undefined)
            this.projectsSubscription.unsubscribe();
        if(this.tasksSubscription!==undefined)
            this.tasksSubscription.unsubscribe();
        this.titleService.setTitle("Project Management");
    }
}