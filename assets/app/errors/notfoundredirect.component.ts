import {Component} from "@angular/core";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-404-redirect',
    templateUrl: './notfoundredirect.component.html',
    styleUrls: ['./notfoundredirect.component.css']
})
export class NotFoundRedirectComponent{


    constructor(private titleService: Title){
        this.titleService.setTitle("404 Error");
    }

    ngOnDestroy(){
        this.titleService.setTitle("Project Management");
    }
}