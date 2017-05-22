import {Component, OnInit} from '@angular/core';
import {SidebarService} from "./sidebar.service";

@Component({
    selector: 'webapp-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit{
    userMenuAvailable=true;

    constructor(private sidebarService: SidebarService){}

    ngOnInit(){
        this.sidebarService.events.forEach(
            event => {
                if(event.match('projectOpened')){
                    this.userMenuAvailable = false;
                }else{
                    this.userMenuAvailable = true;
                }
            }
        );

    }
}
