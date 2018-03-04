import {Component, OnInit, Inject, Optional} from "@angular/core";
import {MAT_DIALOG_DATA,MatDialogRef} from "@angular/material";
import {Router} from "@angular/router";
import {Profile} from "../../../models/profile";
import {ProfileService} from "../../_services/profile.service";

@Component({
    selector:'profile-dialog',
    template: `
        <h2 mat-dialog-title>Quick View</h2>
        <mat-dialog-content>
            <mat-card class="card" style="height: 100%;width:100%">
                <mat-card-header>
                    <div mat-card-avatar class="header-image" ></div>
                    <mat-card-title matTooltip="{{profile?.username}}">{{ profile?.firstName }} {{ profile?.lastName }}</mat-card-title>
                    <mat-card-subtitle><a href="mailto:{{profile.email}}"><small>{{ profile.email}}</small></a></mat-card-subtitle>
                </mat-card-header>
                <img mat-card-image src="/img/city.jpg">
                <mat-card-content>
                    <p>
                        A little about myself:
                    </p><br>
                    <p>{{profile.description}}</p>
                    <p>Active projects: 26</p>
                </mat-card-content>
            </mat-card>
        </mat-dialog-content>
        <mat-dialog-actions>
            <button mat-button mat-dialog-close>No</button>
            <!-- Can optionally provide a result for the closing dialog. -->
            <button mat-button [mat-dialog-close]="true">Yes</button>
        </mat-dialog-actions>
    `,
    providers:[ProfileService]
})
export class ProfileDialogComponent implements OnInit{
    email:string;
    profile:Profile;

    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
        public dialogRef: MatDialogRef<ProfileDialogComponent>,
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