import {AfterViewInit, Component, OnDestroy, ViewChild} from "@angular/core";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';
import {ChatService} from "../../_services/chat.service";
import {Subscription} from "rxjs/Subscription";
import {ProjectService} from "../../_services/projects.service";
import {Project} from "../../../models/project";
import {forEach} from "@angular/router/src/utils/collection";
import {ProfileService} from "../../_services/profile.service";
import {Profile} from "../../../models/profile";
import {EventCreateDialogComponent} from "./eventCreateDialog.component";
import {MdDialog} from "@angular/material";
import {ObservableMedia} from "@angular/flex-layout";

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
export class ChatComponent implements AfterViewInit,OnDestroy{
    @ViewChild('sidenav') sidenav;
    profile:Profile;
    projects:Project[];

    conversationSelected:Project;

    profileSubscription:Subscription = this.profileService.profile$.subscribe((profile)=>{
        this.profile = profile;
    });
    projectsSubscription:Subscription = this.projectService.projects$.subscribe((projects)=>{
        this.projects=projects;
        this.conversationSelected = this.projects[0];
    });

    constructor(private chatService:ChatService,
                private projectService:ProjectService,
                private profileService:ProfileService,
                private dialog:MdDialog,
                private media:ObservableMedia){}

    onConversationSelected(project){
        this.conversationSelected = project;
    }

    setMeeting(){
        let dialogRef = this.dialog.open(EventCreateDialogComponent,{
            data: this.conversationSelected
        });
        dialogRef.afterClosed().subscribe(result => {
            try{
                let tempEvent = this.correctEndDate(result.event);
                console.log(tempEvent,result.project);
                //TODO: send event to db
            }catch(e){
                console.error(e);
            }
        });
    }

    correctEndDate(event){
        let startTemp = event.start.getTime();
        let endTemp = event.end.getTime();
        if(startTemp<endTemp || startTemp==endTemp ) return event;
        event.end=new Date(startTemp+(1000 * 60 * 60));
        return event;
    }

    ngAfterViewInit(){
        this.menuCollapse();
        this.media.subscribe(change => { this.menuCollapse(); });
    }

    menuCollapse() {
        if (this.media.isActive('md')) {
            this.sidenav.close();
        }
        else if (this.media.isActive('sm')) {
            this.sidenav.close();
        }
        else if (this.media.isActive('xs')) {
            this.sidenav.close();
        }
        else{
            this.sidenav.open();
        }
    }

    ngOnDestroy(){
        this.projectsSubscription.unsubscribe();
    }

}