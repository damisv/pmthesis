import {RouterModule, Routes} from "@angular/router";

import {HomepageComponent} from "./homepage/homepage.component";
import {AuthenticationComponent} from "./auth/authentication.component";
import {WebappComponent} from "./webapp/webapp.component";

import {AUTH_ROUTES} from "./auth/auth.routes";
import {WEBAPP_ROUTES} from "./webapp/webapp.routes";
import {NotFoundRedirectComponent} from "./errors/notfoundredirect.component";
import {AppGuard} from "./_guards/appguard";
import {AuthGuard} from "./_guards/authguard";


const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/homepage', pathMatch: 'full'},
    { path: 'homepage', component: HomepageComponent },
    { path: 'app', component: WebappComponent,
        children: WEBAPP_ROUTES,
        canActivate: [AuthGuard],
        canActivateChild: [AppGuard]
    },
    { path: 'auth', component: AuthenticationComponent, children: AUTH_ROUTES},
    { path: '**', redirectTo: '/404', pathMatch: 'full'},
    { path: '404', component: NotFoundRedirectComponent}
];

export const routing = RouterModule.forRoot(APP_ROUTES);