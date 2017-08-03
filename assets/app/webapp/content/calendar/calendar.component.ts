import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from "@angular/core";
import {MdDialog, MdMenu, MdMenuTrigger, MdTabGroup} from "@angular/material";
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
} from 'date-fns';
import {CalendarEventViewDialogComponent} from "./calendarEventViewDialog.component";
import {Subject} from "rxjs/Subject";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';
import {CalendarEventCreateDialogComponent} from "./calendarEventCreateDialog.component";

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


    @ViewChild('calendarView') calendarView:MdTabGroup;

    constructor(private dialog:MdDialog){

    }

    onSelectChange(event:any):void{
        this.view = event.tab.textLabel.toLowerCase();
    }

    events: CalendarEvent[] = [
        {
            title: 'Hackathon',
            color: colors.yellow,
            start: new Date(),
            draggable: true
        },
        {
            title: 'Lantzos pitogyra',
            color: colors.blue,
            start: new Date()
        }
    ];

    eventClicked({ event }: { event: CalendarEvent }): void {
        let dialogRef = this.dialog.open(CalendarEventViewDialogComponent, {
            data: {
                event: event,
                daySelected: this.viewDate
            }
        });
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
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
        this.refresh.next();
    }

    addEvent(date: Date): void {
        /*this.events.push({
            start: date,
            title: 'New event',
            color: colors.red
        });
        this.refresh.next();*/
        let dialogRef = this.dialog.open(CalendarEventCreateDialogComponent,{
            data : date
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            this.events.push(result);
            this.refresh.next();
        });

    }

    seeDay(date){
        this.viewDate = date;
        this.calendarView.selectedIndex = 2;
        this.activeDayIsOpen = false;
    }

    ngOnInit(){
    }
}