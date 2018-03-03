import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material";



@Component({
    selector: 'webapp-calendar-eventcreate-dialog',
    template: `
        <h1 mat-dialog-title>New Event</h1>
        <mat-dialog-content>
            <div    fxLayout="column"
                    fxLayoutAlign="center"
                    fxLayoutGap="10px"
                    fxLayoutGap.xs="0">
                <div fxFlex="auto">
                    <mat-input-container>
                        <input matInput type="text" placeholder="Enter a title for this Event" [(ngModel)]="eventToCreate.title">
                    </mat-input-container>
                </div>
                <div fxFlex>
                    <mat-input-container>
                        <input matInput type="time" placeholder="Start Time For This Event" (change)="setStartTime($event)">
                    </mat-input-container>
                </div>
                <div fxFlex>
                    <mat-input-container>
                        <input matInput [matDatepicker]="picker" placeholder="Choose a date to end this event" [(ngModel)]="endDate" (ngModelChange)="setEndDate($event)">
                        <button matSuffix [matDatepickerToggle]="picker"></button>
                    </mat-input-container>
                    <mat-datepicker #picker></mat-datepicker>
                </div>
                <div fxFlex>
                    <mat-input-container>
                        <input matInput type="time" placeholder="End Time For This Event" (change)="setEndTime($event)">
                    </mat-input-container>
                </div>
                <div fxFlex>
                    <mat-select placeholder="Select A Representative Color" (change)="colorSelected($event.value)">
                        <mat-option *ngFor="let color of colors" [value]="color">
                            {{ color.title.toUpperCase() }}
                        </mat-option>
                    </mat-select>
                </div>
                <div fxFlex>
                    <mat-input-container>
                        <textarea matInput id="" cols="30" rows="2" placeholder="Enter an Event Description" [(ngModel)]="eventToCreate.meta"></textarea>
                    </mat-input-container>
                </div>
            </div>
        </mat-dialog-content>
        <mat-dialog-actions>
            <button mat-raised-button mat-dialog-close>Cancel</button>
            <button mat-raised-button [mat-dialog-close]="eventToCreate">Schedule It !</button>
        </mat-dialog-actions>
        
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

    constructor(@Inject(MAT_DIALOG_DATA) public data: any){
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