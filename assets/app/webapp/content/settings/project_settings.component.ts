import {Component, OnInit} from "@angular/core";
import {ProjectService} from "../../_services/projects.service";
import {Project} from "../../../models/project";
import {Subscription} from "rxjs/Subscription";
import {Profile} from "../../../models/profile";
import {ProfileService} from "../../_services/profile.service";
import {Title} from "@angular/platform-browser";
import {NotificationService} from "../../_services/notification.service";

@Component({
    selector: 'webapp-project-settings',
    templateUrl: './project_settings.component.html',
    styleUrls: ['./project_settings.component.css']
})
export class ProjectSettingsComponent implements OnInit{
    user:Profile;
    project:Project;
    projectSubscriptions:Subscription = this.projectService.project$.subscribe(
        project=>{
            this.project = project;
            this.titleService.setTitle(this.project.name+"'s Settings");
        }
    );
    profileSubscriptions:Subscription = this.profileService.profile$.subscribe(
        profile=>this.user = profile
    );
    private:Boolean;
    locked:Boolean;

    constructor(
        private projectService: ProjectService,
        private profileService: ProfileService,
        private titleService: Title,
        private notificationService:NotificationService)
    {
        if(this.project.typeOf='private') {
            this.private=true;
        } else {
            this.private = false;
        }
    }

    saveSettings(){
        (this.private)? this.project.typeOf='private' : this.project.typeOf='public';
        this.projectService.editProject(this.project)
            .subscribe(
                data => {
                    this.projectService.giveProject(data.project);
                    this.notificationService.create(data.project.name,"Project settings have been successfully saved!","success");
                },
                error => {
                    console.error(error);
                    this.notificationService.create(this.project.name,"Error! Project was not created!","error");
                }
            );
    }

    ngOnInit(){

    }

    ngOnDestroy(){
        if(this.projectSubscriptions!==undefined)
        this.projectSubscriptions.unsubscribe();
        if(this.profileSubscriptions!==undefined)
        this.profileSubscriptions.unsubscribe();
        this.titleService.setTitle("Project Management");
    }

}