import {NgModule} from "@angular/core";

import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
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
import {NotificationsService, PushNotificationsService} from "angular2-notifications/dist";

import {DependenciesDialogComponent} from "./content/tasks/dependenciesdialog.component";
import {ParticlesModule} from "angular-particle";
import {CdkTableModule} from "@angular/cdk/table";
import {ChatComponent} from "./content/chat/chat.component";
import {UserListComponent} from "./content/chat/userlist.component";
import {MessagesComponent} from "./content/chat/messages.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";

import {CalendarModule} from "angular-calendar";
import {CalendarComponent} from "./content/calendar/calendar.component";
import {CalendarEventViewDialogComponent} from "./content/calendar/calendarEventViewDialog.component";
import {ContextMenuModule} from "ngx-contextmenu";
import {CalendarEventCreateDialogComponent} from "./content/calendar/calendarEventCreateDialog.component";
import {ChatService} from "./_services/chat.service";
import {GanttComponent} from "./content/tasks/gantt.component";
import {TeamService} from "./_services/team.service";

import {ActionLogComponent} from "./content/timeline/actionlog.component";
import {InViewportModule} from "ng-in-viewport";
import {EventCreateDialogComponent} from "./content/chat/eventCreateDialog.component";
import {CalendarEventEditDialogComponent} from "./content/calendar/calendarEventEditDialog.component";
import {ActionService} from "./_services/action.service";
import {UserSettingsComponent} from "./content/settings/user_settings.component";
import {CalendarService} from "./_services/calendar.service";
import {ViewProjectComponent} from "./content/projects/view_project.component";
import {TimeAgoPipe} from 'time-ago-pipe';
import {MaterialModule} from "../material.module";

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
        UserSettingsComponent,
        ProjectSettingsComponent,
        TeamProjectComponent,
        InvitesComponent,
        CreateProjectComponent,
        CreateTaskComponent,
        ViewTaskComponent,
        ProfileDialogComponent,
        ViewProjectComponent,
        NotFoundErrorComponent,
        DependenciesDialogComponent,
        ChatComponent,
        UserListComponent,
        MessagesComponent,
        CalendarComponent,
        CalendarEventViewDialogComponent,
        CalendarEventCreateDialogComponent,
        EventCreateDialogComponent,
        CalendarEventEditDialogComponent,
        GanttComponent,
        ActionLogComponent,
        TimeAgoPipe
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        DragulaModule,
        ParticlesModule,
        FlexLayoutModule,
        BrowserModule,
        MaterialModule,
        BrowserAnimationsModule,
        CalendarModule.forRoot(),
        ContextMenuModule,
        InViewportModule.forRoot()
    ],
    providers: [
        SidebarService,
        ProjectService,
        ProfileService,
        InviteService,
        TaskService,
        ProjectGuard,
        NotificationService,
        NotificationsService,
        PushNotificationsService,
        SocketService,
        ChatService,
        TeamService,
        ActionService,
        CalendarService
    ],
    entryComponents:[
        ProfileDialogComponent,
        DependenciesDialogComponent,
        CalendarEventViewDialogComponent,
        CalendarEventCreateDialogComponent,
        EventCreateDialogComponent,
        CalendarEventEditDialogComponent
    ]
})
export class WebappModule {}