import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'webapp-chat-userlist',
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.css']
})
export class UserListComponent {

    @Input()
    userlist;
    @Output()
    onUserSelected = new EventEmitter <String>();

    constructor(){}

    selectUser(user){
        this.onUserSelected.emit(user);
    }
}