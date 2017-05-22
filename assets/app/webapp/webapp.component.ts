import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {Profile} from "../models/profile";
import {ProfileService} from "./_services/profile.service";
import {Subscription} from "rxjs/Subscription";
import {SocketService} from "./socket.service";
import {ProjectService} from "./_services/projects.service";
import {MdButtonToggleGroup} from "@angular/material";

@Component({
    selector: 'my-webapp',
    templateUrl: './webapp.component.html',
    styleUrls: ['./webapp.component.css'],
    providers:[ProfileService,SocketService,ProjectService]
})
export class WebappComponent implements OnDestroy,OnInit{
    profile:Profile;
    subscription:Subscription;

    @ViewChild('group') group:MdButtonToggleGroup;
    groupColor;
    menuColor = 'sidebar blue';

    constructor(private router: Router,
                private profileService:ProfileService,
                private socketService:SocketService,
                private projectService:ProjectService){
    }

    changeMenuColour(color){
        this.menuColor = 'sidebar '+color;
    }


    ngOnInit(){
        /*if(localStorage.getItem('token') === null) {
            if(localStorage.getItem('lastLogged') !== null ){
                this.router.navigateByUrl('/auth/lock');
            }else{
                this.router.navigateByUrl('/auth/signup');
            }
        }else{
            this.subscription = this.profileService.profile$.subscribe(
                profile=>{
                    this.profile = profile;
                }
            );
            this.profileService.getProfile();
            this.projectService.getProjects();
            this.groupColor = 'blue';
            //this.socketService.register(localUser.id);
        }*/
        this.subscription = this.profileService.profile$.subscribe(
            profile=>{
                this.profile = profile;
            }
        );
        this.profileService.getProfile();
        this.projectService.getProjects();
        this.groupColor = 'blue';
        //this.socketService.register(localUser.id);
    }
    ngOnDestroy() {
        if(this.subscription!==undefined)
        this.subscription.unsubscribe();
    }
}