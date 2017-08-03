import {Component} from "@angular/core";
import {ProgressBarService} from "./webapp/_services/progressbar.service";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    progressBar:any;

    private subscription:Subscription = this.progressBarService.progressBar$.subscribe((pbOptions) => this.progressBar = pbOptions);

    constructor(private progressBarService: ProgressBarService){
    }


}