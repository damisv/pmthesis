import {Component, OnDestroy, OnInit} from "@angular/core";
import {Project} from "../../../models/project";
import {ProjectService} from "../../_services/projects.service";
import {ProfileService} from "../../_services/profile.service";
import {Subscription} from "rxjs";
import {Profile} from "../../../models/profile";
import {Title} from "@angular/platform-browser";
import {InviteService} from "../../_services/invite.service";
import {NotificationService} from "../../_services/notification.service";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';
@Component({
    selector: 'webapp-invites',
    templateUrl: './invites.component.html',
    styleUrls: ['./invites.component.css'],
    animations: [trigger('homeTransition', [
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
                    this.notificationService.create("error","Error","Error! Unable to join project!","error");
                }
            )
    }

    addProjectToProjects(id){
        this.projectService.getProject(id).subscribe(
            res=>{
                this.projects.push(res.project);
                this.projectService.giveProjects(this.projects);
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