import {Component, OnInit, Inject, Optional} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Router} from "@angular/router";
import { Error } from "../models/error";

@Component({
    selector:'error-dialog',
    template: `
        <h1 mat-dialog-title>{{error?.title}}</h1>
        <div mat-dialog-content>{{error?.message}}</div>
        <div mat-dialog-actions>
            <button mat-button mat-dialog-close>Close</button>
        </div>
    `
})
export class ErrorDialogComponent implements OnInit{
    error: Error;

    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
        public dialogRef: MatDialogRef<ErrorDialogComponent>,
        public router: Router
    ) {}

    ngOnInit(){ this.error = this.dialogData;}
}