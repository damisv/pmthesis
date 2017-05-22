import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Member, Project} from "../../../models/project";
import {InviteService} from "../../_services/invite.service";

@Component({
    selector: 'project-invite',
    templateUrl: './invite.component.html',
    styleUrls: ['./invite.component.css']
})
export class InviteProjectComponent{
    constructor (private inviteService:InviteService) {}
    @Input() project:Project;
    @Output() addInvite = new EventEmitter<string>();

    onSubmit(email:string) {
        this.inviteService.inviteMember(email,this.project._id)
            .subscribe(
                res=>{
                    this.addInvite.emit(email);
                }
            );
    }
}
