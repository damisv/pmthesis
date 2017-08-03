import {Component, OnDestroy, OnInit} from "@angular/core";
import {ProfileService} from "../../_services/profile.service";
import {Profile} from "../../../models/profile";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Title} from "@angular/platform-browser";
import {NotificationService} from "../../_services/notification.service";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';

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
    myForm: FormGroup;
    profile:Profile;
    subscription: Subscription = this.profileService.profile$.subscribe(
        profile => {
            this.profile = profile;
            //this.titleService.setTitle(this.profile.firstName+"'s profile");
        });

    constructor (private profileService: ProfileService,
                 private titleService: Title,
                 private notificationService:NotificationService) {
    }

    onSubmit() {
        const profile = new Profile(
            this.myForm.value.email,
            this.myForm.value.username,
            this.myForm.value.firstName,
            this.myForm.value.lastName
        );
        this.profileService.edit(profile)
            .subscribe(
                data => {
                    this.profileService.giveProfile(data);
                    this.notificationService.create("Profile Changes Saved","Profile changes have been successfully saved!","success");
                },
                error => {
                    console.error(error);
                    this.notificationService.create("Error!","An error occured while saving profile changes","error");
                }
            );
        this.myForm.reset();
    }

    ngOnInit(){
        this.myForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            lastName: new FormControl(null, Validators.required),
            firstName: new FormControl(null, Validators.required),
            username: new FormControl(null, Validators.required)
        });
        this.titleService.setTitle("My Profile");
    }
    ngOnDestroy() {
        if(this.subscription!==undefined)
        this.subscription.unsubscribe();
        this.titleService.setTitle("Project Management");
    }
}