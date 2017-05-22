import {Routes} from "@angular/router";

import {SignupComponent} from "./signup/signup.component";
import {SigninComponent} from "./signin/signin.component";
import {LockComponent} from "./lock/lock.component";

export const AUTH_ROUTES: Routes =[
    { path: '', redirectTo: 'signup', pathMatch: 'full'},
    { path: 'signup', component: SignupComponent},
    { path: 'signin', component: SigninComponent},
    { path: 'lock', component: LockComponent}
];