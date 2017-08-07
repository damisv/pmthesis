import {AfterViewInit, Component} from "@angular/core";
import {Project} from "../../../models/project";
import {ProjectService} from "../../_services/projects.service";
import {Subscription} from "rxjs";
import {Title} from "@angular/platform-browser";
import {TaskService} from "../../_services/task.service";
import {Router} from "@angular/router";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';

declare var Highcharts:any;

@Component({
    selector: 'webapp-project-dashboard',
    templateUrl: './project_dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
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
export class ProjectDashboardComponent implements AfterViewInit{
    taskSubscription:Subscription ;
    project:Project;

    taskAvailable=true;

    subscription:Subscription;

    constructor(private projectService:ProjectService,private titleService:Title,private taskService:TaskService,private router:Router){
    }


    ngAfterViewInit(){
        this.subscription = this.projectService.project$.subscribe(
            project => {
                this.project = project;
                this.titleService.setTitle(this.project.name+" Project Dashboard");
                this.taskSubscription = this.taskService.getTasksOfProject(this.project._id).subscribe(
                    tasks => {
                        let taskTotal:number = 0;
                        let completed:number=0;
                        let inProgress:number=0;
                        for(let task of tasks){
                            taskTotal++;
                            (task.completed)? completed++ : inProgress++;
                        }
                        (taskTotal>0)? this.taskAvailable=true:this.taskAvailable=false;
                        if(this.taskAvailable){
                            this.initPieOptions(completed,inProgress,taskTotal);
                        }
                        this.initIssuesChart();
                        this.initMilestonesMock();
                    }
                );
            }
        );
    }

    initMilestonesMock(){
        Highcharts.chart('milestonesChartContainer', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Milestones - 15'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Milestones ',
                colorByPoint:true,
                data: [
                    {
                        name: 'Open',
                        y: 56.33,
                        color: '#DC7633'
                    },
                    {
                        name: 'Closed',
                        y: 24.03,
                        sliced: true,
                        selected: true,
                        color: '#85929E'
                    }
                ]
            }],
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

    initIssuesChart(){
        Highcharts.chart('issuesChartContainer', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Issues Statistics - 15'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Issues Statistics ',
                colorByPoint:true,
                data: [
                    {
                        name: 'Open',
                        y: 56.33,
                        color: '#DC7633'
                    },
                    {
                        name: 'Closed',
                        y: 24.03,
                        sliced: true,
                        selected: true,
                        color: '#85929E'
                    }
                ]
            }],
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


    initPieOptions(completed,inProgress,taskTotal){
        Highcharts.chart('taskChartContainer', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Tasks Statistics - '+taskTotal
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Task Statistics ',
                colorByPoint:true,
                data: [
                    {name:'Completed', y:completed,sliced:true,selected:true},
                    {name:'In Progress', y:inProgress}
                ]
            }],
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

    openTasks(){
        this.router.navigateByUrl('/app/project/tasks');
    }

    ngOnDestroy(){
        if(this.subscription!==undefined)
        this.subscription.unsubscribe();
        this.titleService.setTitle("Project Management");
    }
}