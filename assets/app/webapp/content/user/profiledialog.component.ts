import {Component, OnInit, Inject, Optional} from "@angular/core";
import {MD_DIALOG_DATA,MdDialogRef} from "@angular/material";
import {Router} from "@angular/router";
import {Profile} from "../../../models/profile";
import {ProfileService} from "../../_services/profile.service";

@Component({
    selector:'profile-dialog',
    template: `
        <div class="card card-user" style="overflow:auto;">
            <div class="image">
                <img src="/img/skyline.jpg" alt="h:300&w:400"/>
            </div>
            <div class="content">
                <div class="author">
                    <a (click)="openProfile()"><img class="avatar border-gray" src="/img/avatar.jpg" alt="..."/></a>
                        <h4 class="title">
                            {{ profile?.firstName }}&nbsp;{{ profile?.lastName }}<br />
                            <a href="mailto:{{profile?.email}}"><small>{{ profile?.email}}</small></a><br />
                            <small *ngIf="profile?.username">({{ profile?.username }})</small>
                        </h4>
                </div>
                <br>
                <p class="description text-center">Here goes about me</p>
            </div>
            <hr>

            <div class="text-center">
                <button href="#" class="btn btn-simple"><i class="fa fa-facebook-square"></i></button>
                <button href="#" class="btn btn-simple"><i class="fa fa-twitter"></i></button>
                <button href="#" class="btn btn-simple"><i class="fa fa-github"></i></button>
            </div>
        </div>
        <!--<md-card >
            <md-card-header style="background-image: url('/img/skyline.jpg');background-size:cover;">
                <div md-card-avatar style="background-image:url('/img/avatar.jpg');background-size:cover;"></div>
                <md-card-title>{{profile?.firstName}}&nbsp;{{ profile?.lastName}}</md-card-title>
                <md-card-subtitle>{{profile?.email}}</md-card-subtitle>
            </md-card-header>
            <md-card-content>
                <p>
                    This is the about me section
                </p>
            </md-card-content>
            <md-card-actions>
                <button href="#" class="btn btn-simple"><i class="fa fa-facebook-square"></i></button>
                <button href="#" class="btn btn-simple"><i class="fa fa-twitter"></i></button>
                <button href="#" class="btn btn-simple"><i class="fa fa-github"></i></button>
            </md-card-actions>
        </md-card>-->
    `,
    providers:[ProfileService]
})
export class ProfileDialogComponent implements OnInit{
    email:string;
    profile:Profile;


    constructor(
        @Optional() @Inject(MD_DIALOG_DATA) private dialogData: any,
        public dialogRef: MdDialogRef<ProfileDialogComponent>,
        public router: Router,
        private profileService:ProfileService
    ) {}

    openProfile(){
        this.router.navigateByUrl('app/profile/'+this.email);
        this.dialogRef.close();
    }

    ngOnInit(){
        this.email = this.dialogData;
        this.profileService.getOtherProfile(this.email).subscribe(
            data => {
                this.profile = data.profile;
            },
            error => console.error(error)
        );
    }

}