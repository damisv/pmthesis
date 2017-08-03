import {Component} from "@angular/core";
import {MdDialogRef} from "@angular/material";

@Component({
    selector:'video-tour-homepage',
    template: `        
        <md-dialog-content>
            <iframe width="854" height="480" src="https://www.youtube.com/embed/AZ1pHmWhIuY" frameborder="0" allowfullscreen></iframe>
        </md-dialog-content>`,
    styles: [``]
})
export class VideotourComponent {

    constructor(public dialogRef: MdDialogRef<VideotourComponent>){
    }
}