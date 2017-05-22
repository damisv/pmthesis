import {Component, OnInit} from "@angular/core";
import {Member, Project} from "../../../models/project";
import {ProjectService} from "../../_services/projects.service";
import {Subscription} from "rxjs";
import {MdDialog, MdDialogConfig} from "@angular/material";
import {ProfileDialogComponent} from "../user/profiledialog.component";
import {InviteService} from "../../_services/invite.service";

@Component({
    selector: 'webapp-project-team',
    templateUrl: './project_team.component.html',
    styleUrls: ['./project_team.component.css']
})
export class TeamProjectComponent implements OnInit{

    private invites=[];
    private project:Project;
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
                public dialog: MdDialog,
                private inviteService:InviteService){
    }

    addInvite(email:string){
        this.invites.push(email);
    }

    onEmailHover(email:string){
        const configProfile = new MdDialogConfig();
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