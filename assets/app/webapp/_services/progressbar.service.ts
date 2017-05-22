import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subject} from "rxjs/Subject";

@Injectable()
export class ProgressBarService {

    progressBarOptions = {
        available : false,
        color : 'primary',
        mode : 'indeterminate',
        value : 50,
        bufferValue : 75
    };

    private progressBar = new BehaviorSubject<any>(this.progressBarOptions);
    progressBar$ = this.progressBar.asObservable();

    constructor(){
    }

    availableProgress(){
        this.progressBarOptions.available = !this.progressBarOptions.available;
        this.progressBar.next(this.progressBarOptions);
    }

    updateProgress(addNumber:number):void{
        this.progressBarOptions.value+=addNumber;
        this.progressBar.next(this.progressBarOptions);
    }
}