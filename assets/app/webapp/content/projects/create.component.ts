import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {ProjectService} from "../../_services/projects.service";
import {Member, Project} from "../../../models/project";
import {MdGridList, MdSnackBar} from "@angular/material";
import {ProfileService} from "../../_services/profile.service";
import {InviteService} from "../../_services/invite.service";
import { ObservableMedia } from "@angular/flex-layout";
import {NotificationService} from "../../_services/notification.service";

@Component({
    selector: 'project-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css']
})
export class CreateProjectComponent implements OnInit{
    @Input() email:string;
    @Output() projectCreated = new EventEmitter<Project>();

    project:Project = new Project('');
    membersToInvite = [];
    msg:String="";

    membersAutocomplete:Array<string>=[];
    memberToInvite:String=null;

    @ViewChild('grid')
    private grid: MdGridList;
    maxColumns: number = 2;

    constructor (private projectService: ProjectService,
                 private profileService:ProfileService,
                 public snackBar: MdSnackBar,
                 private inviteService:InviteService,
                 private media: ObservableMedia,
                 private notificationService:NotificationService
    ) {
        this.project.typeOf='public';
    }

    ngOnInit(){
    }

    ngAfterViewInit(){
        this.updateGrid();
        this.media.subscribe(change => { this.updateGrid(); });
    }

    updateGrid(): void {
        if (this.media.isActive('xl')) { this.grid.cols = 5; this.maxColumns=2; }
        else if (this.media.isActive('lg')) { this.grid.cols = 4; this.maxColumns=2; }
        else if (this.media.isActive('md')) { this.grid.cols = 3; this.maxColumns=2; }
        else if (this.media.isActive('sm')) { this.grid.cols = 2; this.maxColumns=2; }
        else if (this.media.isActive('xs')) { this.grid.cols = 1; this.maxColumns=1; }
    }

    onInvite(){
        for(let member of this.membersToInvite){
            if(member.email===this.memberToInvite){
                this.openSnackBar(member.email+" already invited",'',2000);
                return;
            }
        }
        if(this.memberToInvite===this.email){
            this.openSnackBar("You cannot invite yourself to this project",'',2000);
            return;
        }
        if(this.memberToInvite==null || this.memberToInvite===""){
            this.memberToInvite='';
            return;
        }
        this.profileService.userIsRegistered(this.memberToInvite).subscribe(
            res=>{
                if(!res.isRegistered){
                    this.openSnackBar(res.email+" does not exist",'',2000);
                    //this.msg  =" - User does not exist";
                }else {
                    this.membersToInvite.push({email:res.email});
                    this.openSnackBar(res.email+" added to invites",'',2000);
                }
            }
        );
        this.memberToInvite=null;
    }

    onSubmit() {
        if(this.project.name==='') return;
        this.project.team = [new Member("manager",this.email)];
        this.projectService.createProject(this.project)
            .subscribe(res => {
                    this.inviteMembers(res.project._id);
                    this.projectCreated.emit(res.project);
                },
                error => {
                    this.notificationService.create("error",this.project.name,"Error! Project was not created!","error");
                }
            );
    }

    inviteMembers(id){
        let invites = {project:id,invites:[]};
        for(let member of this.membersToInvite){
            invites.invites.push(member.email);
        }
        this.inviteService.inviteMembers(invites).subscribe(
            res=>{
                this.membersToInvite = []; //todo need?
            }
        );
    }

    removeInvite(email:string){
        this.membersToInvite.splice(this.membersToInvite.indexOf(email),1);
        this.openSnackBar("Invited member removed",'',2000);
    }

    openSnackBar(message,action,duration){
        this.snackBar.open(message,action,{duration:duration});//{duration:duration}
    }

    search(event){
        if(this.memberToInvite.length<1){
            this.membersAutocomplete = [];
        }else{
            this.profileService.filterEmails(this.memberToInvite).subscribe(res=>{
                this.membersAutocomplete = res;
            });
        }
    }
}
