import {Component, OnDestroy, OnInit} from "@angular/core";
import {ProfileService} from "../../_services/profile.service";
import {Profile} from "../../../models/profile";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Title} from "@angular/platform-browser";
import {NotificationService} from "../../_services/notification.service";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';
import {ProjectService} from "../../_services/projects.service";

@Component({
    selector: 'webapp-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    animations: [ trigger('homeTransition', [
        transition(':enter', [
            query('.card', style({ opacity: 0 })),
            query('.card', stagger(300, [
                style({ transform: 'translateY(100px)' }),
                animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(0px)', opacity: 1})),
            ])),
        ]),
        transition(':leave', [
            query('.card', stagger(300, [
                style({ transform: 'translateY(0px)', opacity: 1 }),
                animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(100px)', opacity: 0})),
            ])),
        ])
    ]) ],
    host: {
        '[@homeTransition]': ''
    }
})
export class ProfileComponent implements OnInit,OnDestroy{
    profile:Profile;
    subscription: Subscription = this.profileService.profile$.subscribe(
        profile => {
            this.profile = profile;
            //this.titleService.setTitle(this.profile.firstName+"'s profile");
        });
    projectsSubscription: Subscription = this.projectService.projects$.subscribe(
        project => {
            this.activeProjects = project.length;
            //this.titleService.setTitle(this.profile.firstName+"'s profile");
        });
    activeProjects;

    constructor (private profileService: ProfileService,
                 private titleService: Title,
                 private notificationService:NotificationService,
                 private projectService:ProjectService) {

    }

    onSubmit() {
        if(this.profile.email){
            this.profileService.edit(this.profile)
                .subscribe(
                    data => {
                        this.profileService.giveProfile(data);
                    },
                    error => {
                        console.error(error);
                        this.notificationService.create("error","Error!","An error occured while saving profile changes","error");
                    }
                );
        }
    }

    ngOnInit(){
        this.titleService.setTitle("My Profile");
    }
    ngOnDestroy() {
        if(this.subscription!==undefined)
        this.subscription.unsubscribe();
        this.projectsSubscription.unsubscribe();
        this.titleService.setTitle("Project Management");
    }
}