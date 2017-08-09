import {Component, Inject} from "@angular/core";
import {MD_DIALOG_DATA} from "@angular/material";



@Component({
    selector: 'webapp-calendar-eventcreate-dialog',
    template: `
        <h1 md-dialog-title>New Event</h1>
        <md-dialog-content>
            <div    fxLayout="column"
                    fxLayoutAlign="center"
                    fxLayoutGap="10px"
                    fxLayoutGap.xs="0">
                <div fxFlex="auto">
                    <md-input-container>
                        <input mdInput type="text" placeholder="Enter a title for this Event" [(ngModel)]="eventToCreate.title">
                    </md-input-container>
                </div>
                <div fxFlex>
                    <md-input-container>
                        <input mdInput type="time" placeholder="Start Time For This Event" (change)="setStartTime($event)">
                    </md-input-container>
                </div>
                <div fxFlex>
                    <md-input-container>
                        <input mdInput [mdDatepicker]="picker" placeholder="Choose a date to end this event" [(ngModel)]="endDate" (ngModelChange)="setEndDate($event)">
                        <button mdSuffix [mdDatepickerToggle]="picker"></button>
                    </md-input-container>
                    <md-datepicker #picker></md-datepicker>
                </div>
                <div fxFlex>
                    <md-input-container>
                        <input mdInput type="time" placeholder="End Time For This Event" (change)="setEndTime($event)">
                    </md-input-container>
                </div>
                <div fxFlex>
                    <md-select placeholder="Select A Representative Color" (change)="colorSelected($event.value)">
                        <md-option *ngFor="let color of colors" [value]="color">
                            {{ color.title.toUpperCase() }}
                        </md-option>
                    </md-select>
                </div>
                <div fxFlex>
                    <md-input-container>
                        <textarea mdInput id="" cols="30" rows="2" placeholder="Enter an Event Description" [(ngModel)]="eventToCreate.meta"></textarea>
                    </md-input-container>
                </div>
            </div>
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
    endDate:Date=new Date();
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
        start: this.startDate,
        end: this.endDate,
        title: '',
        draggable: true,
        color: {
            primary: '#ad2121',
            secondary: '#FAE3E3'
        },
        meta:null,
        actions:[]
    };

    constructor(@Inject(MD_DIALOG_DATA) public data: any){
        this.startDate = new Date(data);
    }

    setStartDate(event):void{
        let hoursTemp = this.eventToCreate.start.getHours();
        let minsTemp = this.eventToCreate.start.getMinutes();
        this.startDate.setMinutes(minsTemp);
        this.startDate.setHours(hoursTemp);
        this.eventToCreate.start = this.startDate;
        console.log(this.eventToCreate);
    }
    setEndDate(event):void{
        let hoursTemp = this.eventToCreate.end.getHours();
        let minsTemp = this.eventToCreate.end.getMinutes();
        this.endDate.setMinutes(minsTemp);
        this.endDate.setHours(hoursTemp);
        this.eventToCreate.end = this.endDate;
        console.log(this.eventToCreate);
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