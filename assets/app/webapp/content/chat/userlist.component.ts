import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'webapp-chat-userlist',
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.css']
})
export class UserListComponent {

    @Input()
    projects;
    @Output()
    onConversationSelected = new EventEmitter <String>();

    constructor(){}

    selectConversation(project){
        this.onConversationSelected.emit(project);
    }
}