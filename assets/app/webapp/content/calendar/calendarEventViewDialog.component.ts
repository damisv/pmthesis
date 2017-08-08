import {Component, Inject} from "@angular/core";
import {MD_DIALOG_DATA} from "@angular/material";


@Component({
    selector: 'webapp-calendar-eventview-dialog',
    template: `
        <h1 md-dialog-title>{{event.title}}</h1>
        <h4 md-dialog-title>Selected day : {{ currentDate | date:'d MMMM of y'}}</h4>
        <md-dialog-content>
            Start Date : {{ event.start | date:'d MMMM of y H:m' }}
            <br>
            End Date : {{ event.end | date:'d MMMM of y H:m' }}
            <br>
            {{event?.meta}}
        </md-dialog-content>
    `,
    styles: []
})
export class CalendarEventViewDialogComponent {
    event:any;
    currentDate:Date;

    constructor(@Inject(MD_DIALOG_DATA) public data: any){
        this.event = data.event;
        this.currentDate = data.daySelected;
    }
}