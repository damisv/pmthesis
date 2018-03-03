import {AfterViewInit, Component, OnDestroy, ViewChild, OnInit} from "@angular/core";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';
import {Subscription} from "rxjs/Subscription";
import {ProjectService} from "../../_services/projects.service";
import {Project} from "../../../models/project";
import {ProfileService} from "../../_services/profile.service";
import {Profile} from "../../../models/profile";
import {EventCreateDialogComponent} from "./eventCreateDialog.component";
import {MatDialog} from "@angular/material";
import {ObservableMedia} from "@angular/flex-layout";
import {ActivatedRoute, Router} from "@angular/router";
import {CalendarService} from "../../_services/calendar.service";

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
export class ChatComponent implements OnInit,AfterViewInit,OnDestroy{
    @ViewChild('sidenav') sidenav;
    profile:Profile=null;
    projects:Project[]=null;

    conversationSelected:Project=null;

    profileSubscription:Subscription = this.profileService.profile$.subscribe((profile)=>{
        this.profile = profile;
    });
    projectsSubscription:Subscription = this.projectService.projects$.subscribe((projects)=>{
        this.projects=projects;
    });

    constructor(
                private projectService:ProjectService,
                private profileService:ProfileService,
                private dialog:MatDialog,
                private media:ObservableMedia,
                private router:Router,
                private route:ActivatedRoute,
                private calendarService:CalendarService){}


    onConversationSelected(project){
        this.conversationSelected = project;
        this.router.navigate(['app/chat', {outlets: {'messages': [project._id]}}]);
    }
    //TODO: add team event
    setMeeting(){
        let dialogRef = this.dialog.open(EventCreateDialogComponent,{
            data: this.conversationSelected
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result!=null){
                let tempEvent = this.correctEndDate(result.event);
                this.calendarService.scheduleProjectEvent(tempEvent,result.project._id).subscribe();
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

    ngOnInit(){
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
        if(this.projectsSubscription!==undefined)
        this.projectsSubscription.unsubscribe();
    }


}