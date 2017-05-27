import {Component, OnDestroy, OnInit} from "@angular/core";
import {Project} from "../../../models/project";
import {ProjectService} from "../../_services/projects.service";
import {ProfileService} from "../../_services/profile.service";
import {Subscription} from "rxjs";
import {Profile} from "../../../models/profile";
import {Title} from "@angular/platform-browser";
import {InviteService} from "../../_services/invite.service";
import {NotificationService} from "../../_services/notification.service";

@Component({
    selector: 'webapp-invites',
    templateUrl: './invites.component.html',
    styleUrls: ['./invites.component.css']
})
export class InvitesComponent implements OnInit,OnDestroy{
    user:Profile;
    projects:Project[] = [];
    invites:Project[];
    profileSubscription:Subscription = this.profileService.profile$.subscribe(
        profile => {
            this.user = profile;
            this.invites = [];

            this.inviteService.getMyInvites(this.user.email).subscribe(
             res=>{
                for(let project of res.projects){
                    this.invites.push(new Project(project.name,project._id));
                }
             })
        }
    );
    projectsSubscription:Subscription = this.projectService.projects$.subscribe(
        projects => this.projects = projects
    );
    constructor (private projectService: ProjectService,
                 private profileService: ProfileService,
                 private titleService:Title,
                 private inviteService:InviteService,
                 private notificationService:NotificationService){
    }

    acceptInvite(projectId){
        this.inviteService.acceptInvite(this.user.email,projectId)
            .subscribe(
                res=>{
                    this.addProjectToProjects(res.id);
                    this.removeProject(res.id);
                },error =>{
                    this.notificationService.create("Error","Error! Unable to join project!","error");
                }
            )
    }

    addProjectToProjects(id){
        this.projectService.getProject(id).subscribe(
            res=>{
                this.projects.push(res.project);
                this.projectService.giveProjects(this.projects);
                this.notificationService.create(res.project.name,"You have successfully joined " + res.project.name,"success");
            },error=>{
                console.log(error);
            }
        );
    }

    removeProject(id){
        for(let i=0;i<this.invites.length;i++){
            if(this.invites[i]._id===id){
                this.invites.splice(i,1);
                return;
            }
        }
    }
    ngOnInit() {
        this.titleService.setTitle("My Invites");
    }
    ngOnDestroy(){
        if(this.profileSubscription!==undefined)
        this.profileSubscription.unsubscribe();
        if(this.projectsSubscription!==undefined)
        this.projectsSubscription.unsubscribe();
    }
}