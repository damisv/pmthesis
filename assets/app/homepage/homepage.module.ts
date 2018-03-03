import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

import {HomepageComponent} from "./homepage.component";
import {NavComponent} from "./nav/nav.component";
import {AboutComponent} from "./about/about.component";
import {FooterComponent} from "./footer/footer.component";
import {ScrollToModule} from "@nicky-lenaers/ngx-scroll-to";
import {FlexLayoutModule} from "@angular/flex-layout";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {VideotourComponent} from "./about/videotour.component";
import {MaterialModule} from "../material.module";

@NgModule({
    declarations: [
        HomepageComponent,
        NavComponent,
        AboutComponent,
        FooterComponent,
        VideotourComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        RouterModule,
        MaterialModule,
        ScrollToModule.forRoot(),
        FlexLayoutModule
    ],
    entryComponents:[VideotourComponent],
    providers: []
})
export class HomepageModule {}