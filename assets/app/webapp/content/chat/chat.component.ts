import {Component} from "@angular/core";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';

@Component({
    selector: 'webapp-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    animations: [trigger('homeTransition', [
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
    host :{
        '[@homeTransition]':''
    }
})
export class ChatComponent {
    users = [
        'Danny','Gabriel','Alex','Michael','Jian Yang','George'
    ];

    userSelected = this.users[0];

    constructor(){}

    onUserSelected(user){
        this.userSelected = user;
    }

}