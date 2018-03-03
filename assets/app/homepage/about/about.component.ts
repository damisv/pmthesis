import {Component} from "@angular/core";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';
import {MatDialog} from "@angular/material";
import {VideotourComponent} from "./videotour.component";


@Component({
    selector: 'my-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    animations: [ trigger('aboutTransition', [
        transition(':enter', [
            query('.block', style({ opacity: 0 })),
            query('.block', stagger(300, [
                style({ transform: 'translateY(100px)' }),
                animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(0px)', opacity: 1})),
            ])),
        ]),
        transition(':leave', [
            query('.block', stagger(300, [
                style({ transform: 'translateY(0px)', opacity: 1 }),
                animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(100px)', opacity: 0})),
            ])),
        ])
    ])],
    host: {
        '[@aboutTransition]': ''
    }
})
export class AboutComponent {

    constructor(private dialog:MdDialog){}

    playVideoTour(){
        let videoTourDialog = this.dialog.open(VideotourComponent);
    }
}