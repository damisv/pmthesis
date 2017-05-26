import { Injectable } from "@angular/core";
import { NotificationsService, PushNotificationsService} from "angular2-notifications/dist";

@Injectable()
export class NotificationService {

    types = ["error","success","info","alert","warn"];

    constructor(private toastService:NotificationsService,
                private pushService:PushNotificationsService)
    {}

    toastOptions = {
        timeOut:5000
    };

    pushOptions = {
        body: "Ka8ari mera stin anoi3ia"
    };

    toast(title?,content?,type?,options?){
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
        this.toastService.create(title,content,type,options);
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

    create(title?,content?,type?) {
        if(content===undefined){
            content = "";
        }
        if(title===undefined){
            title = "";
        }
        if(this.types.indexOf(type.toLowerCase())<0){
            console.log("Toast wrong type!");
            type = this.types[2]; //info
        }

        if (this.pushService.permission === "denied") {
            this.toast(title, content,type);
        } else {
            this.pushService.requestPermission();
            this.pushService.create(
                title,
                {
                    body:content,
                    //icon:"url",
                    icon:"https://docs.nativescript.org/img/cli-getting-started/angular/chapter0/Angular_logo.png"
                }
            ).subscribe(
                res => console.log(res),
                err => {
                    console.log(err);
                    this.toast(title, "Description", "success");
                }
            )
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
