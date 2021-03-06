import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {Profile} from "../models/profile";
import {ProfileService} from "./_services/profile.service";
import {Subscription} from "rxjs/Subscription";
import {SocketService} from "./_services/socket.service";
import {ProjectService} from "./_services/projects.service";
import {ChatService} from "./_services/chat.service";
import {ObservableMedia} from "@angular/flex-layout";
import {MatSidenav} from "@angular/material";
import {SidebarService} from "./sidebar/sidebar.service";
import {NotificationService} from "./_services/notification.service";
import {Notification} from "../models/notification";

@Component({
    selector: 'my-webapp',
    templateUrl: './webapp.component.html',
    styleUrls: ['./webapp.component.css'],
    providers:[ProfileService,SocketService,ProjectService]
})
export class WebappComponent implements OnDestroy,OnInit,AfterViewInit{
    profile:Profile;
    subscription:Subscription;
    userMenuAvailable=true;
    @ViewChild('sidenav') sidenav:MatSidenav;
    isMobile:boolean=false;
    unseenNotifications:Notification[] = [];
    seenNotifications:Notification[] = [];
    //notifications:Notification[];
    notificationsSubscription:Subscription = this.notificationService.notifications$.subscribe(
        notifications=>{
            notifications.forEach(function(notification){
                if(notification.status=="unseen"){
                    if(this.unseenNotifications.findIndex(function(value){
                            return value._id == notification._id;
                        })>-1){
                        this.unseenNotifications.push(notification);
                    }
                }else{
                    if(this.seenNotifications.findIndex(function(value){
                            return value._id == notification._id;
                        })>-1){
                        this.seenNotifications.push(notification);
                    }
                }
            },this);
            //this.unseenNotifications = notifications;
        });

    @HostListener('document:hover',['$event']) particleHover;

    //Particles
    myStyle: object = {};
    myParams: object = {};
    width: number = 100;
    height: number = 100;
    //

    groupColor;
    menuColor = 'sidebar blue';

    sidebarSubscription:Subscription = this.sidebarService.status$.subscribe(
        status => this.userMenuAvailable = status);

    //Search
    result:Array<{}> = [];
    resultProfile:Array<{}> = [];
    resultProject:Array<{}> = [];

    constructor(private profileService:ProfileService,
                private socketService:SocketService, //don't delete
                private projectService:ProjectService,
                private chatService:ChatService,
                private router:Router,
                private media: ObservableMedia,
                private sidebarService:SidebarService,
                private notificationService:NotificationService){
    }


    changeMenuColour(color){
        this.menuColor = 'sidebar '+color;
    }

    search(e:any){
        if(e.length<1){
            this.result = [];
        }else{
            this.profileService.filterEmails(e).subscribe(res=>{
                this.resultProfile = res.map(function(profile){return ({value:profile.email,type:'profile',id:profile.email})});
                this.result = this.resultProfile.concat(this.resultProject);
            });
            this.projectService.filterName(e).subscribe(res=>{
                this.resultProject = res.map(function(project){return ({value:project.name,type:'project',id:project._id})});
                this.result = this.resultProfile.concat(this.resultProject);
            });
        }
    }

    onResultSelected(value){
        if(value.type.match('profile')){
            this.router.navigate(['app/profile/',value.id]);
        }else if(value.type.match('project')) {
            this.projectService.getProject(value.id).subscribe((project)=>{
                if(project.project){
                    if(project.project.team.find(x => x.email == this.profile.email)){
                        this.projectService.giveProject(project.project);
                        this.router.navigate(['app','project']);
                    }else{
                        this.router.navigate(['app','viewproject', value.id]);
                    }
                }
            });
        }
    }

    onSeenNotification(notification):void{
        let tempIndex = this.unseenNotifications.indexOf(notification);
        if(tempIndex > -1){
            /*
               this.notificationService.onSeenNotification.subscribe((result)=>{
                    this.unseenNotifications.splice(tempIndex,1);
                    this.seenNotifications.push(notification);
               });
             */
            this.unseenNotifications.splice(tempIndex,1);
            this.seenNotifications.push(notification);
            notification.status = "seen";
            this.notificationService.save(notification).subscribe();
        }
    }

    ngOnInit(){
        this.subscription = this.profileService.profile$.subscribe(
            profile=>{
                this.profile = profile;
                localStorage.setItem('lastLogged',profile.email);
                this.notificationService.get();
            }
        );
        this.profileService.getProfile();
        this.projectService.getProjects();
        //TODO Private Messages here. Also team chat?
        /*this.chatService.getMessages().subscribe(res=>{
            this.chatService.addMessages(res.messages);
        });*/
        //this.socketService.register(); not needed anymore
        this.groupColor = 'blue';


        this.myStyle = {
            'position': 'fixed',
            'width': '100%',
            'height': '100%',
            'top': 0,
            'left': 0,
            'right': 0,
            'bottom': 0,
            'background-color': '#fff'
        };

        this.myParams = {
            particles: {
                number: {
                    value: 130,
                },
                color: {
                    value: '#2a43ca'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 50,
                        opacity_min: 0.1,
                        sync: true
                    }
                },
                line_linked:{
                    enable: true,
                    color: '#4f4fca'
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'bubble'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 200,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 200,
                        size: 80,
                        duration: 0.4
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                },
                mouse: {}
            },
            retina_detect: true
        };

    }

    ngAfterViewInit(){
        this.menuCollapse();
        this.media.subscribe(change => { this.menuCollapse(); });
    }

    menuCollapse() {
        if (this.media.isActive('md')) {
            this.sidenav.close();
            this.isMobile = true;
        } else if (this.media.isActive('sm')) {
            this.sidenav.close();
            this.isMobile = true;
        } else if (this.media.isActive('xs')) {
            this.sidenav.close();
            this.isMobile=true;
        } else{
            this.sidenav.open();
            this.isMobile=false;
        }
    }

    onLogout(){
        localStorage.removeItem('token');
        this.router.navigate(['/']);
    }

    ngOnDestroy() {
        if(this.subscription!==undefined)
            this.subscription.unsubscribe();
        if(this.notificationsSubscription!==undefined)
            this.notificationsSubscription.unsubscribe();
    }
}