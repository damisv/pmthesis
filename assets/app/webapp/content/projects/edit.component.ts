import {Component, EventEmitter, Input, Output} from "@angular/core";
import { Project} from "../../../models/project";
import {ProjectService} from "../../_services/projects.service";

@Component({
    selector: 'project-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditProjectComponent{
    constructor (private projectService: ProjectService) {}
    @Input() project:Project;
    @Output() editProject = new EventEmitter<String>();

    onSubmit(event) {
        let project = JSON.parse(JSON.stringify(this.project));
        this.project.name = event.target.value;
        this.projectService.editProject(this.project)
            .subscribe(res => {
                    this.editProject.emit(res.project.name);
                },error =>{ this.project =  JSON.parse(JSON.stringify(project));}
            );
        event.target.blur();
    }
}


