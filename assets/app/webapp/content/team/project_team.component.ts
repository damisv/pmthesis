import {Component, OnInit} from "@angular/core";
import {Member, Project} from "../../../models/project";
import {ProjectService} from "../../_services/projects.service";
import {Subscription} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {ProfileDialogComponent} from "../user/profiledialog.component";
import {InviteService} from "../../_services/invite.service";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';

@Component({
    selector: 'webapp-project-team',
    templateUrl: './project_team.component.html',
    styleUrls: ['./project_team.component.css'],
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
export class TeamProjectComponent implements OnInit{

    invites=[];
    project:Project;
    selectedOption;

    subscription:Subscription = this.projectService.project$.subscribe(
        project => {
            this.project = project;
            this.getInvites();
        }
    );

    getInvites(){
        this.inviteService.getProjectInvites(this.project._id).subscribe(
            res=>{
                this.invites = res.invites;
            },error=>{}
        );
    }

    constructor(private projectService: ProjectService,
                public dialog: MatDialog,
                private inviteService:InviteService){
    }

    addInvite(email:string){
        this.invites.push(email);
    }

    onEmailHover(email:string){
        const configProfile = new MatDialogConfig();
        configProfile.data = email;
        let dialogProfile = this.dialog.open(ProfileDialogComponent,configProfile);
        dialogProfile.afterClosed().subscribe(result => {
            this.selectedOption = result;
        });
    }

    ngOnInit() {

    }

    ngOnDestroy(){
        if(this.subscription!==undefined)
        this.subscription.unsubscribe();
    }

}