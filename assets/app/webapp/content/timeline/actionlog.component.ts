import {Component, Renderer2} from "@angular/core";

import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';

@Component({
    selector: 'webapp-project-actionlog',
    templateUrl: './actionlog.component.html',
    styleUrls: ['./actionlog.component.css'],
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
export class ActionLogComponent {
    logs = [
        {name:'Project Created',date: new Date()},
        {name: 'First Task Created',date:new Date()},
        {name: 'Second Task Created',date: new Date()},
        {name: 'First Task Completed',date:new Date()},
        {name: 'Project went public',date:new Date()},
        {name: 'John joined this project as a member',date:new Date()},
        {name: 'Issues started to appear',date:new Date()},
        {name: 'George joined this project as a member',date:new Date()},
        {name: 'Paul joined this project as manager',date:new Date()},
        {name: 'Team completed 50% of projects milestones until now',date:new Date()},
        {name: 'Clara joined this project as a Product Owner',date:new Date()}
    ];

    constructor(private renderer: Renderer2) {
    }

    action(event){
        if (event.value) {
            this.renderer.addClass(event.target, 'in-view');
        } else {
            this.renderer.removeClass(event.target, 'in-view');
        }
    }

}