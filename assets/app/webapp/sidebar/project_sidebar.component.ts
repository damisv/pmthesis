import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {SidebarService} from "./sidebar.service";

@Component({
    selector: 'webapp-project-sidebar',
    templateUrl: './project_sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class ProjectSidebarComponent implements OnInit{
    id:any;
    private sub: any;

    constructor(private route:ActivatedRoute,private sidebarService: SidebarService){}

    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });
        this.sidebarService.newEvent('projectOpened');
    }
    ngOnDestroy(){
        this.sub.unsubscribe();
        this.sidebarService.newEvent('projectClosed');
    }

}