import { Routes } from "@angular/router";

import {DashboardComponent} from "./content/dashboard/dashboard.component";
import {ProfileComponent} from "./content/user/profile.component";
import {OthersProfileComponent} from "./content/user/others_profile.component";
import {TasksComponent} from "./content/tasks/tasks.component";
import {IssuesComponent} from "./content/issues/issues.component";
import {ProjectsComponent} from "./content/projects/projects.component";
import {ProjectDashboardComponent} from "./content/dashboard/project_dashboard.component";
import {ProjectTasksComponent} from "./content/tasks/project_tasks.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {ProjectSidebarComponent} from "./sidebar/project_sidebar.component";
import {ProjectSettingsComponent} from "./content/settings/project_settings.component";
import {InvitesComponent} from "./content/invites/invites.component";
import {TeamProjectComponent} from "./content/team/project_team.component";
import {NotFoundErrorComponent} from "./errors/notfound.component";
import {ProjectGuard} from "../_guards/projectguard";
import {ViewTaskComponent} from "./content/tasks/viewtask.component";

export const WEBAPP_ROUTES: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '' , component: SidebarComponent, outlet: 'sidebar'},
    { path: 'dashboard', component: DashboardComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'profile/:id', component: OthersProfileComponent},
    { path: 'mytasks', component: TasksComponent },
    { path: 'myissues', component: IssuesComponent},
    { path: 'myprojects', component: ProjectsComponent },
    { path: 'invites', component: InvitesComponent},
    { path: 'project',children:[
        { path: '',redirectTo: 'dashboard',pathMatch:'full'},
        { path: '', component: ProjectSidebarComponent, outlet: 'projectsidebar'},
        { path: 'dashboard', component: ProjectDashboardComponent},
        { path: 'tasks', component: ProjectTasksComponent},
        {path: 'taskview',component: ViewTaskComponent},
        { path: 'settings', component: ProjectSettingsComponent,canActivate: [ProjectGuard]},
        { path: 'team', component: TeamProjectComponent},
        { path: '**', redirectTo: '404', pathMatch: 'full'},
        { path: '404', component: NotFoundErrorComponent}
    ]},
    { path: '**', redirectTo: '404', pathMatch: 'full'},
    { path: '404', component: NotFoundErrorComponent}
];