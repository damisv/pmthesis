import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatTabGroup} from "@angular/material";
import {CalendarEvent, CalendarEventTimesChangedEvent} from 'angular-calendar';
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns'
import {Subject} from "rxjs/Subject";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';
import {CalendarEventViewDialogComponent} from "./calendarEventViewDialog.component";
import {CalendarEventCreateDialogComponent} from "./calendarEventCreateDialog.component";
import {CalendarEventEditDialogComponent} from "./calendarEventEditDialog.component";
import {CalendarService} from "../../_services/calendar.service";
import {ProjectService} from "../../_services/projects.service";
import {Subscription} from "rxjs/Subscription";
import {Project} from "../../../models/project";

export const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};

@Component({
    selector: 'webapp-calendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './calendar.component.html',
    styles: [`
        .card {
            border-radius: 6px!important;
            box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)!important;
            margin-bottom:1em;
        }
        .card:hover {
            box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.34), 0 6px 30px 5px rgba(0, 0, 0, 0.32), 0 8px 10px -5px rgba(0, 0, 0, 0.6)!important;
            transition: all 0.3s cubic-bezier(.25,.8,.25,1)!important;
        }
        h3 {
            margin: 0 0 10px;
        }

        pre {
            background-color: #f5f5f5;
            padding: 15px;
        }
    `],animations: [trigger('homeTransition', [
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
export class CalendarComponent implements OnInit {
    viewDate: Date = new Date();
    view:string = 'month';
    activeDayIsOpen: boolean = true;
    refresh: Subject<any> = new Subject();
    events;
    myEvents = [];
    projectEvents = [];
    projects:Project[]=null;

    @ViewChild('calendarView') calendarView: MatTabGroup;

    projectsSubscription:Subscription = this.projectService.projects$.subscribe((projects)=>{
        this.projects=projects;
        projects.forEach(function(project){
            this.getProjectEvents(project._id);
        },this);
    });

    getProjectEvents(project_id){
        this.calendarService.getProjectEvents(project_id).subscribe(res=>{
            res.events.forEach(function(event){
                if(this.events.findIndex(function(value){
                        return value._id == event._id;
                    })<0){
                    this.makeEvents([event]);
                }
            },this);
        });
    };

    constructor(private dialog: MatDialog, private calendarService: CalendarService, private projectService: ProjectService){
        //TODO add Team Events
        calendarService.getMyEvents().subscribe(res=>{
            this.events = [];
            this.makeEvents(res.events);
        });
        /*calendarService.getProjectEvents('123456').subscribe(res=>{
            res.events.forEach(function(event){
                if(this.projectEvents.findIndex(function(value){
                        return value._id == event._id;
                    })>-1){
                    this.projectEvents.push(event);
                }
            },this);
            this.events = this.myEvents.concat(this.projectEvents);
        });*/
        //calendarService.getTeamEvents('team').subscribe();
    }

    makeEvents(events){
        events.forEach(function(event){
            event.start = new Date(event.start);
            event.end = new Date(event.end);
            event.actions = this.addActions();
            this.events.push(event);
        },this);
    }

    addActions(){
        return [{
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event }): void => {
                let editDialog = this.dialog.open(CalendarEventEditDialogComponent,{
                    data: event
                });
                editDialog.afterClosed().subscribe((result)=>{
                    this.calendarService.updateMyEvent(event).subscribe();
                    event.actions = this.addActions();
                    if(result) console.log(result);
                    this.refresh.next();
                });
            }
        },
            {
                label: '<i class="fa fa-fw fa-times"></i>',
                onClick: ({ event }: { event }): void => {
                    this.events = this.events.filter(iEvent => iEvent !== event);
                    this.calendarService.deleteMyEvent(event).subscribe();
                    console.log('Event deleted', event);
                    this.refresh.next();
                }
            }];
    }

    onSelectChange(event:any):void{
        this.view = event.tab.textLabel.toLowerCase();
    }

    //eventClicked({ event }: { event: CalendarEvent }): void {
    eventClicked({ event }: { event }): void {
        let dialogRef = this.dialog.open(CalendarEventViewDialogComponent, {
            data: {
                event: event,
                daySelected: this.viewDate
            }
        });
    }
    dayClicked({ date, events }: { date: Date; events }): void {
        if (isSameMonth(date, this.viewDate)) {
            if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0)
            {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.calendarService.updateMyEvent(event).subscribe(()=>{
            event.actions = this.addActions();
            this.refresh.next();
        });

    }

    addEvent(date: Date): void {
        let dialogRef = this.dialog.open(CalendarEventCreateDialogComponent,{
            data : date
        });
        dialogRef.afterClosed().subscribe(result => {
            let tempEvent = this.correctEndDate(result);
            this.calendarService.scheduleMyEvent(tempEvent).subscribe(res=>{
                this.makeEvents([res.event]);
                this.refresh.next();
            });

        });
    }

    //Check if end Date is later than start,otherwise end is start+1 hour
    correctEndDate(event){
        let startTemp = event.start.getTime();
        let endTemp = event.end.getTime();
        if(startTemp<endTemp || startTemp==endTemp ) return event;
        event.end=new Date(startTemp+(1000 * 60 * 60));
        return event;
    }

    seeDay(date){
        this.viewDate = date;
        this.calendarView.selectedIndex = 2;
        this.activeDayIsOpen = false;
    }

    ngOnInit(){
    }

    ngOnDestroy(){
        if(this.projectsSubscription!==undefined)
        this.projectsSubscription.unsubscribe();
    }
}