import {Component, OnInit} from "@angular/core";
import {NotificationService} from "../../_services/notification.service";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'webapp-user-settings',
    templateUrl: './user_settings.component.html',
    styleUrls: ['./user_settings.component.css']
})
export class UserSettingsComponent implements OnInit{
    types;
    settings;
    settingsSubscription:Subscription = this.notificationService.notificationSettings$.subscribe(
        settings => {
            this.settings = settings;
        });

    constructor(private notificationService:NotificationService){
        this.types = notificationService.getNotificationTypes();
    }

    saveNotificationSettings(){
        this.notificationService.setSettings(this.settings);
    }

    ngOnDestroy(){
        if(this.settingsSubscription!==undefined)
            this.settingsSubscription.unsubscribe();
    }

    ngOnInit(){
        this.notificationService.getNotificationSettings().subscribe(res=>{
            this.settings = res.settings;
            this.notificationService.giveSettings(res.settings);
        });
    }
}