import {Component, OnInit} from "@angular/core";
import {SidebarService} from "./sidebar.service";

@Component({
    selector: 'webapp-project-sidebar',
    templateUrl: './project_sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class ProjectSidebarComponent implements OnInit{

    constructor(private sidebarService: SidebarService){}

    ngOnInit(){
        this.sidebarService.changeStatus();
    }
    ngOnDestroy(){
        this.sidebarService.changeStatus();
    }

}