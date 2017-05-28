import { Injectable } from "@angular/core";
import {Notification, NotificationsService, PushNotificationsService} from "angular2-notifications/dist";
import {Router} from "@angular/router";

@Injectable()
export class NotificationService {

    types = ["error","success","info","alert","warn"];

    constructor(private toastService:NotificationsService,
                private pushService:PushNotificationsService,
                private router:Router)
    {}

    toastOptions = {
        timeOut:5000
    };

    pushOptions = {
        body: "Ka8ari mera stin anoi3ia"
    };

    toast(title?,content?,type?,options?,route?){
        if(type===undefined)
            type = this.types[2]; //info
        else
            if(this.types.indexOf(type.toLowerCase())<0){
                console.log("Toast wrong type!");
                type = this.types[2]; //info
            }
        if(options===undefined){
            options=this.toastOptions;
        }
        if(content===undefined){
            content = "";
        }
        if(title===undefined){
            title = "";
        }
        let toast = this.toastService.create(title,content,type,options);

        if(route!==undefined){
            toast.click.subscribe(function(){//notif, mouseEvent){
                this.router.navigate(route);
            }.bind(this, toast));
        }
    }

    push(title){
        if(this.pushService.permission !=="denied")
        this.pushService.requestPermission();
        this.pushService.create(title, this.pushOptions).subscribe(
            res => console.log(res),
            err => {
                console.log(err);
            }
        )
    }

    create(title?,content?,type?,options?,route?) {
        if(content===undefined){
            content = "";
        }
        if(title===undefined){
            title = "";
        }

        if (this.pushService.permission === "granted") {
            this.pushService.create(
                title,
                {
                    body:content,
                    //icon:"url",
                    icon:"https://docs.nativescript.org/img/cli-getting-started/angular/chapter0/Angular_logo.png"
                }
            ).subscribe(
                res => {},
                err => {
                    console.log(err);
                }
            )
        } else {
            if(this.pushService.permission === "default")this.pushService.requestPermission();
            this.toast(title, content,type,options,route);
        }
    }
}

/*
interface PushNotification {
     body?: string
     icon?: string
     tag?: string
     renotify?: boolean
     silent?: boolean
     sound?: string
     noscreen?: boolean
     sticky?: boolean
     dir?: 'auto' | 'ltr' | 'rtl'
     lang?: string
     vibrate?: number[]
}
*/
