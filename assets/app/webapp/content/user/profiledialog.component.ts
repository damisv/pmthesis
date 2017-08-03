import {Component, OnInit, Inject, Optional} from "@angular/core";
import {MD_DIALOG_DATA,MdDialogRef} from "@angular/material";
import {Router} from "@angular/router";
import {Profile} from "../../../models/profile";
import {ProfileService} from "../../_services/profile.service";

@Component({
    selector:'profile-dialog',
    template: `
        <h2 md-dialog-title>Quick View</h2>
        <md-dialog-content>
            <md-card class="card" style="height: 100%;width:100%">
                <md-card-header>
                    <div md-card-avatar class="header-image" ></div>
                    <md-card-title mdTooltip="{{profile?.username}}">{{ profile?.firstName }} {{ profile?.lastName }}</md-card-title>
                    <md-card-subtitle><a href="mailto:{{profile.email}}"><small>{{ profile.email}}</small></a></md-card-subtitle>
                </md-card-header>
                <img md-card-image src="/img/city.jpg">
                <md-card-content>
                    <p>
                        A little about myself:
                    </p><br>
                    <p>{{profile.description}}</p>
                    <p>Active projects: 26</p>
                </md-card-content>
            </md-card>
        </md-dialog-content>
        <md-dialog-actions>
            <button md-button md-dialog-close>No</button>
            <!-- Can optionally provide a result for the closing dialog. -->
            <button md-button [md-dialog-close]="true">Yes</button>
        </md-dialog-actions>
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