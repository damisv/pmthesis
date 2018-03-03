import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material";


@Component({
    selector: 'webapp-calendar-eventview-dialog',
    template: `
        <h1 mat-dialog-title>{{event.title}}</h1>
        <h4 mat-dialog-title>Selected day : {{ currentDate | date:'d MMMM of y'}}</h4>
        <mat-dialog-content>
            Start Date : {{ event.start | date:'d MMMM of y H:m' }}
            <br>
            End Date : {{ event.end | date:'d MMMM of y H:m' }}
            <br>
            {{event?.meta}}
        </mat-dialog-content>
    `,
    styles: []
})
export class CalendarEventViewDialogComponent {
    event:any;
    currentDate:Date;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any){
        this.event = data.event;
        this.currentDate = data.daySelected;
    }
}