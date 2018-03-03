import {Component} from "@angular/core";
import {MatDialogRef} from "@angular/material";

@Component({
    selector:'video-tour-homepage',
    template: `        
        <mat-dialog-content>
            <iframe width="854" height="480" src="https://www.youtube.com/embed/AZ1pHmWhIuY" frameborder="0" allowfullscreen></iframe>
        </mat-dialog-content>`,
    styles: [``]
})
export class VideotourComponent {

    constructor(public dialogRef: MatDialogRef<VideotourComponent>){
    }
}