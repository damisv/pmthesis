import {Component, EventEmitter, Input, Output} from "@angular/core";
import { Project} from "../../../models/project";
import {InviteService} from "../../_services/invite.service";
import {NotificationService} from "../../_services/notification.service";

@Component({
    selector: 'project-invite',
    templateUrl: './invite.component.html',
    styleUrls: ['./invite.component.css']
})
export class InviteProjectComponent{
    constructor (private inviteService:InviteService,
                 private notificationService:NotificationService) {}
    @Input() project:Project;
    @Output() addInvite = new EventEmitter<string>();

    onSubmit(email:string) {
        this.inviteService.inviteMember(email,this.project._id)
            .subscribe(
                res=>{
                    this.addInvite.emit(email);
                    this.notificationService.create("Invite send "+email,"An invite has been send to "+email,"success");
                },error=>{
                    this.notificationService.create(" Error Invite failed","Error! Unable to send invite to "+email,"error");
                }
            );
    }
}
