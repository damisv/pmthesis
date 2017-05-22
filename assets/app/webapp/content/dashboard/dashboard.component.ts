import {Component, OnInit} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {ProfileService} from "../../_services/profile.service";
import {Profile} from "../../../models/profile";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'webapp-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

    profile:Profile;
    subscription:Subscription  = this.profileService.profile$.subscribe(
        profile => {
            this.profile = profile;
            //this.titleService.setTitle(this.profile.firstName+"'s Dashboard");
        }
    );

    constructor(private profileService: ProfileService,private titleService: Title){
    }

    ngOnInit(){
        this.titleService.setTitle("My Dashboard");
    }
    ngOnDestroy(){
        if(this.subscription!==undefined)
        this.subscription.unsubscribe();
        this.titleService.setTitle("Project Management");
    }
}