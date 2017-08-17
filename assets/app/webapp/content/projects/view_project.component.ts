import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ProjectService} from "../../_services/projects.service";
import {Project} from "../../../models/project";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';

@Component({
    selector: 'webapp-view-project',
    templateUrl: './view_project.component.html',
    styleUrls: ['./view_project.component.css'],
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
export class ViewProjectComponent implements OnInit{
    project:Project = new Project('test');

    constructor(
                private route:ActivatedRoute,
                private projectService:ProjectService){}

    ngOnInit(){
        this.route.params.subscribe((params)=>{
           if(params.id){
               this.projectService.getProject(params.id).subscribe((project)=>{
                   this.project = project.project;
               });
           }
        });
    }
}