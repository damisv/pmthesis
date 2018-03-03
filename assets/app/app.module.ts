import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import 'hammerjs';

import {AppComponent} from "./app.component";
import {AuthenticationComponent} from "./auth/authentication.component";

import {SigninComponent} from "./auth/signin/signin.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {LockComponent} from "./auth/lock/lock.component";
import {AuthfooterComponent} from "./auth/footer/authfooter.component";
import {AuthnavComponent} from "./auth/nav/authnav.component";
import {routing} from "./app.routing";
import {AuthService} from "./auth/auth.service";

import {WebappModule} from "./webapp/webapp.module";
import {HomepageModule} from "./homepage/homepage.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NotFoundRedirectComponent} from "./errors/notfoundredirect.component";
import {AuthGuard} from "./_guards/authguard";
import {AppGuard} from "./_guards/appguard";

import { FlexLayoutModule } from "@angular/flex-layout";
import {ProgressBarService} from "./webapp/_services/progressbar.service";
import { ErrorDialogComponent} from "./errors/error.component";
import {PushNotificationsModule,SimpleNotificationsModule} from "angular2-notifications";
import {MaterialModule} from "./material.module";



@NgModule({
    declarations: [
        AppComponent,
        AuthenticationComponent,
        SigninComponent,
        SignupComponent,
        LockComponent,
        AuthfooterComponent,
        AuthnavComponent,
        NotFoundRedirectComponent,
        ErrorDialogComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        routing,
        HomepageModule,
        WebappModule,
        MaterialModule,
        FlexLayoutModule,
        SimpleNotificationsModule.forRoot(),
        PushNotificationsModule
    ],
    providers: [AuthService,AuthGuard,AppGuard,ProgressBarService],
    bootstrap: [AppComponent],
    entryComponents:[
        ErrorDialogComponent
    ]
})
export class AppModule {

}