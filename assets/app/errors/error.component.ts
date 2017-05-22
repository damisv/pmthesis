import {Component, OnInit, Inject, Optional} from "@angular/core";
import {MD_DIALOG_DATA,MdDialogRef} from "@angular/material";
import {Router} from "@angular/router";

@Component({
    selector:'error-dialog',
    template: `
        <h1 md-dialog-title>{{error?.title}}</h1>
        <div md-dialog-content>{{error?.message}}</div>
        <div md-dialog-actions>
            <button md-button md-dialog-close>Close</button>
        </div>
    `
})
export class ErrorDialogComponent implements OnInit{
    error: Error;

    constructor(
        @Optional() @Inject(MD_DIALOG_DATA) private dialogData: any,
        public dialogRef: MdDialogRef<ErrorDialogComponent>,
        public router: Router
    ) {}

    ngOnInit(){
        this.error = this.dialogData;
    }

}