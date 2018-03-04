import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector:'webapp-calendar-edit-dialog',
  template: `
      <h1 mat-dialog-title>{{event.title}}</h1>
      <mat-dialog-content>
          <div    fxLayout="column"
                  fxLayoutAlign="center"
                  fxLayoutGap="10px"
                  fxLayoutGap.xs="0">
              <div fxFlex="auto">
                  <mat-input-container>
                      <input matInput type="text" placeholder="Enter a title for this Event" [(ngModel)]="event.title">
                  </mat-input-container>
              </div>
              <div fxFlex>
                  <mat-form-field>
                      <input matInput [matDatepicker]="startPicker" placeholder="Choose a date to start this event" [(ngModel)]="startDate" (ngModelChange)="setStartDate($event)">
                      <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                      <mat-datepicker #startPicker></mat-datepicker>
                  </mat-form-field>
              </div>
              <div fxFlex>
                  <mat-input-container>
                      <input matInput type="time" placeholder="Start Time For This Event" [(ngModel)]="startTime" (change)="setStartTime($event)">
                  </mat-input-container>
              </div>
              <div fxFlex>
                  <mat-form-field>
                      <input matInput [matDatepicker]="endPicker" placeholder="Choose a date to end this event" [(ngModel)]="endDate" (ngModelChange)="setEndDate($event)">
                      <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                      <mat-datepicker #endPicker></mat-datepicker>
                  </mat-form-field>
              </div>
              <div fxFlex>
                  <mat-input-container>
                      <input matInput type="time" placeholder="End Time For This Event" [(ngModel)]="endTime" (change)="setEndTime($event)">
                  </mat-input-container>
              </div>
              <div fxFlex>
                  <mat-input-container>
                      <textarea matInput cols="30" rows="2" placeholder="Enter an Event Description" [(ngModel)]="event.meta"></textarea>
                  </mat-input-container>
              </div>
          </div>
      </mat-dialog-content>
      <mat-dialog-actions>
          <button mat-raised-button mat-dialog-close>Cancel</button>
          <button mat-raised-button [mat-dialog-close]="event">Schedule It !</button>
      </mat-dialog-actions>
  `,
  styles:[]
})
export class CalendarEventEditDialogComponent {

    event;
    startDate;
    endDate;
    endTime;
    startTime;

    constructor(@Inject(MAT_DIALOG_DATA) data:any){
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