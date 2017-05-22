import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {MaterialModule} from "@angular/material";

import {HomepageComponent} from "./homepage.component";
import {NavComponent} from "./nav/nav.component";
import {AboutComponent} from "./about/about.component";
import {FooterComponent} from "./footer/footer.component";



@NgModule({
    declarations: [
        HomepageComponent,
        NavComponent,
        AboutComponent,
        FooterComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule
    ],
    providers: []
})
export class HomepageModule {

}