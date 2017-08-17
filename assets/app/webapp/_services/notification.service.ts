import { Injectable } from "@angular/core";
import {NotificationsService, PushNotificationsService} from "angular2-notifications";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Notification} from "../../models/notification";
import { Http, Headers, Response } from "@angular/http";
import {Observable} from "rxjs/Observable";
import {ProgressBarService} from "./progressbar.service";

@Injectable()
export class NotificationService {

    private notifications = new BehaviorSubject<Notification[]>([]);

    notifications$ = this.notifications.asObservable();

    get(){
        this.progressBarService.availableProgress();
        this.post("get",{}).subscribe(res=>{
            this.notifications.next(res.notifications);
        });
    }

    save(notification:Notification){
        this.progressBarService.availableProgress();
        const body = {notification:notification};
        this.post("create",body);
    }

    add(notification:Notification){
        this.notifications.getValue().push(notification);
        console.log(JSON.stringify(this.notifications.getValue()));
    }

    private post(url,body){
        body.token = localStorage.getItem("token");
        body = JSON.stringify(body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post("notification/"+url, body, {headers: headers})
            .map(response => response.json())
            .catch(this.handleError).finally(() => this.progressBarService.availableProgress());
    }

    private handleError (error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    types = ["error","success","info","alert","warn"];
    settings = {
        "myTask":"push",
        "memberJoined":"none",
        "invite":"toast",
        "message":"push",
        "error":"push"};

    constructor(private toastService:NotificationsService,
                private pushService:PushNotificationsService,
                private router:Router,
                private http:Http,
                private progressBarService: ProgressBarService)
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

    create(setting?,title?,content?,type?,options?,route?) {
        if(this.settings[setting]==="push"){
            if(content===undefined){
                content = "";
            }
            if(title===undefined){
                title = "";
            }
            if(this.pushService.permission === "default")this.pushService.requestPermission();
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
            }
        }else if(this.settings[setting]==="toast"){
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
