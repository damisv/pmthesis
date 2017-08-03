import {Component, Inject} from "@angular/core";
import {MD_DIALOG_DATA} from "@angular/material";



@Component({
    selector: 'webapp-calendar-eventcreate-dialog',
    template: `
        <h1 md-dialog-title>New Event</h1>
        <md-dialog-content>
            <md-input-container>
                <input mdInput type="text" placeholder="Enter a title for this Event" [(ngModel)]="eventToCreate.title">
            </md-input-container>
            <br>
            <md-input-container>
                <input mdInput type="time" placeholder="Start Time For This Event" (change)="setStartTime($event)">
            </md-input-container>
            <br>
            <md-input-container>
                <input mdInput [mdDatepicker]="picker" placeholder="Choose a date to end this event" [(ngModel)]="endDate">
                <button mdSuffix [mdDatepickerToggle]="picker"></button>
            </md-input-container>
            <md-datepicker #picker></md-datepicker>
            <br>
            <md-input-container>
                <input mdInput type="time" placeholder="End Time For This Event" (change)="setEndTime($event)">
            </md-input-container>
            <br>
            <md-select placeholder="Select A Representative Color" (change)="colorSelected($event.value)">
                <md-option *ngFor="let color of colors" [value]="color">
                    {{ color.title.toUpperCase() }}
                </md-option>
            </md-select>
        </md-dialog-content>
        <md-dialog-actions>
            <button md-raised-button md-dialog-close>Cancel</button>
            <button md-raised-button [md-dialog-close]="eventToCreate">Schedule It !</button>
        </md-dialog-actions>
        
    `,
    styles: []
})
export class CalendarEventCreateDialogComponent {
    startDate:Date;
    endDate:Date;

    colors: any = [
        {   title: 'red',
            primary: '#ad2121',
            secondary: '#FAE3E3'
        },
         {  title: 'blue',
            primary: '#1e90ff',
            secondary: '#D1E8FF'
        },
        {
            title: 'yellow',
            primary: '#e3bc08',
            secondary: '#FDF1BA'
        }
        ];

    eventToCreate = {
        start: new Date(),
        end: new Date(),
        title: '',
        color: {
            primary: '#ad2121',
            secondary: '#FAE3E3'
        }
    };

    constructor(@Inject(MD_DIALOG_DATA) public data: any){
        this.startDate = new Date(data);
    }

    setStartTime(event):void{
        let time = event.target.value;
        let timeParts = time.split(":");
        this.startDate.setHours(timeParts[0]);
        this.startDate.setMinutes(timeParts[1]);
        this.eventToCreate.start = this.startDate;
        console.log(this.eventToCreate);
    }
    setEndTime(event):void{
        let time = event.target.value;
        let timeParts = time.split(":");
        this.endDate.setHours(timeParts[0]);
        this.endDate.setMinutes(timeParts[1]);
        this.eventToCreate.end = this.endDate;
        console.log(this.eventToCreate);
    }

    colorSelected(color){
        let colorTemp = {
            primary: color.primary,
            secondary: color.secondary
        };
        this.eventToCreate.color = colorTemp;
    }
}