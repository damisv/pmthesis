import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {MaterialModule, MdNativeDateModule} from "@angular/material";
import {WebappComponent} from "./webapp.component";
import {DashboardComponent} from "./content/dashboard/dashboard.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {FooterwebappComponent} from "./footer/footer.component";
import {ProfileComponent} from "./content/user/profile.component";
import {TasksComponent} from "./content/tasks/tasks.component";
import {ProjectsComponent} from "./content/projects/projects.component";
import {DragulaModule} from "ng2-dragula";

import {ProjectTasksComponent} from "./content/tasks/project_tasks.component";
import {IssuesComponent} from "./content/issues/issues.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CreateProjectComponent} from "./content/projects/create.component";
import {InviteProjectComponent} from "./content/team/invite.component";
import {EditProjectComponent} from "./content/projects/edit.component";
import {OthersProfileComponent} from "./content/user/others_profile.component";
import {ProjectSidebarComponent} from "./sidebar/project_sidebar.component";
import {ProjectDashboardComponent} from "./content/dashboard/project_dashboard.component";
import {SidebarService} from "./sidebar/sidebar.service";
import {ProjectSettingsComponent} from "./content/settings/project_settings.component";
import {TeamProjectComponent} from "./content/team/project_team.component";
import {InvitesComponent} from "./content/invites/invites.component";
import {CreateTaskComponent} from "./content/tasks/create_task.component";
import {MyDatePickerModule} from "mydatepicker";
import {ProfileDialogComponent} from "./content/user/profiledialog.component";
import {NotFoundErrorComponent} from "./errors/notfound.component";
import {ProjectService} from "./_services/projects.service";
import {ProfileService} from "./_services/profile.service";
import {InviteService} from "./_services/invite.service";
import {TaskService} from "./_services/task.service";
import {ProjectGuard} from "../_guards/projectguard";
import {ViewTaskComponent} from "./content/tasks/viewtask.component";
import {NotificationService} from "./_services/notification.service";
import {SocketService} from "./_services/socket.service";


@NgModule({
    declarations: [
        WebappComponent,
        SidebarComponent,
        ProjectSidebarComponent,
        NavbarComponent,
        FooterwebappComponent,
        DashboardComponent,
        ProfileComponent,
        OthersProfileComponent,
        TasksComponent,
        IssuesComponent,
        ProjectsComponent,
        ProjectDashboardComponent,
        ProjectTasksComponent,
        InviteProjectComponent,
        EditProjectComponent,
        ProjectSettingsComponent,
        TeamProjectComponent,
        InvitesComponent,
        CreateProjectComponent,
        CreateTaskComponent,
        ViewTaskComponent,
        ProfileDialogComponent,
        NotFoundErrorComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MaterialModule,
        DragulaModule,
        MyDatePickerModule,
        MdNativeDateModule,
    ],
    providers: [
        SidebarService,
        ProjectService,
        ProfileService,
        InviteService,
        TaskService,
        ProjectGuard,
        NotificationService,
        SocketService
    ],
    entryComponents:[
        ProfileDialogComponent
    ]
})
export class WebappModule {

}