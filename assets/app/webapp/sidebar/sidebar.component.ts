import {Component, OnInit} from '@angular/core';
import {SidebarService} from "./sidebar.service";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'webapp-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent{

    userMenuAvailable = true;

    sidebarSubscription:Subscription = this.sidebarService.status$.subscribe(
        status => this.userMenuAvailable = status);

    constructor(private sidebarService:SidebarService){
    }

    ngOnDestroy(){
        this.sidebarSubscription.unsubscribe();
    }

}
