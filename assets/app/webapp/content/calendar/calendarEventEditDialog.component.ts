import {Component, Inject} from "@angular/core";
import {MD_DIALOG_DATA} from "@angular/material";

@Component({
  selector:'webapp-calendar-edit-dialog',
  template: `
      <h1 md-dialog-title>{{event.title}}</h1>
      <md-dialog-content>
          <div    fxLayout="column"
                  fxLayoutAlign="center"
                  fxLayoutGap="10px"
                  fxLayoutGap.xs="0">
              <div fxFlex="auto">
                  <md-input-container>
                      <input mdInput type="text" placeholder="Enter a title for this Event" [(ngModel)]="event.title">
                  </md-input-container>
              </div>
              <div fxFlex>
                  <md-input-container>
                      <input mdInput [mdDatepicker]="startPicker" placeholder="Choose a date to start this event" [(ngModel)]="startDate" (ngModelChange)="setStartDate($event)">
                      <button mdSuffix [mdDatepickerToggle]="startPicker"></button>
                  </md-input-container>
                  <md-datepicker #startPicker></md-datepicker>
              </div>
              <div fxFlex>
                  <md-input-container>
                      <input mdInput type="time" placeholder="Start Time For This Event" [(ngModel)]="startTime" (change)="setStartTime($event)">
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
                      <input mdInput type="time" placeholder="End Time For This Event" [(ngModel)]="endTime" (change)="setEndTime($event)">
                  </md-input-container>
              </div>
              <div fxFlex>
                  <md-input-container>
                      <textarea mdInput cols="30" rows="2" placeholder="Enter an Event Description" [(ngModel)]="event.meta"></textarea>
                  </md-input-container>
              </div>
          </div>
      </md-dialog-content>
      <md-dialog-actions>
          <button md-raised-button md-dialog-close>Cancel</button>
          <button md-raised-button [md-dialog-close]="event">Schedule It !</button>
      </md-dialog-actions>
  `,
  styles:[]
})
export class CalendarEventEditDialogComponent {

    event;
    startDate;
    endDate;
    endTime;
    startTime;

    constructor(@Inject(MD_DIALOG_DATA) data:any){
        this.event = data;
        this.startDate = data.start;
        this.endDate = data.end;
        let startMinutesTemp = this.event.start.getMinutes();
        let startHoursTemp = this.event.start.getHours();
        if(startHoursTemp<10){
            startHoursTemp = '0'+startHoursTemp;
        }
        if(startMinutesTemp<10){
            startMinutesTemp ='0'+startMinutesTemp;
        }
        this.startTime = startHoursTemp+':'+startMinutesTemp;

        let endHoursTemp = this.event.end.getHours();
        let endMinutesTemp = this.event.end.getMinutes();
        if(endHoursTemp<10){
            endHoursTemp = '0'+endHoursTemp;
        }
        if(endMinutesTemp<10){
            endMinutesTemp = '0'+endMinutesTemp;
        }
        this.endTime = endHoursTemp+':'+endMinutesTemp;
    }

    setStartDate(event):void{
        let hoursTemp = this.event.start.getHours();
        let minsTemp = this.event.start.getMinutes();
        this.startDate.setMinutes(minsTemp);
        this.startDate.setHours(hoursTemp);
        this.event.start = this.startDate;
    }
    setEndDate(event):void{
        let hoursTemp = this.event.end.getHours();
        let minsTemp = this.event.end.getMinutes();
        this.endDate.setMinutes(minsTemp);
        this.endDate.setHours(hoursTemp);
        this.event.end = this.endDate;
    }

    setStartTime(event):void{
        let time = event.target.value;
        let timeParts = time.split(":");
        this.startDate.setHours(timeParts[0]);
        this.startDate.setMinutes(timeParts[1]);
        this.event.start = this.startDate;
    }
    setEndTime(event):void{
        let time = event.target.value;
        let timeParts = time.split(":");
        this.endDate.setHours(timeParts[0]);
        this.endDate.setMinutes(timeParts[1]);
        this.event.end = this.endDate;
    }

}