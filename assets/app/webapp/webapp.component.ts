import {Component, HostListener, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {Profile} from "../models/profile";
import {ProfileService} from "./_services/profile.service";
import {Subscription} from "rxjs/Subscription";
import {SocketService} from "./_services/socket.service";
import {ProjectService} from "./_services/projects.service";
import {ChatService} from "./_services/chat.service";

@Component({
    selector: 'my-webapp',
    templateUrl: './webapp.component.html',
    styleUrls: ['./webapp.component.css'],
    providers:[ProfileService,SocketService,ProjectService]
})
export class WebappComponent implements OnDestroy,OnInit{
    profile:Profile;
    subscription:Subscription;
    userMenuAvailable=true;

    notifications = [
        {name:'A new task has been assigned to you!',date:'24/7/2017'},
        {name: 'Bill Gates has invited you to a new project! ', date:'24/7/2017'},
        {name:'A new task has been assigned to you!',date:'24/7/2017'},
        {name: 'Bill Gates has invited you to a new project! ', date:'24/7/2017'},
        {name:'A new task has been assigned to you!',date:'24/7/2017'},
        {name: 'Bill Gates has invited you to a new project! ', date:'24/7/2017'}
    ];


    @HostListener('document:hover',['$event']) particleHover;

    //Particles
    myStyle: object = {};
    myParams: object = {};
    width: number = 100;
    height: number = 100;
    //

    groupColor;
    menuColor = 'sidebar blue';

    constructor(private profileService:ProfileService,
                private socketService:SocketService, //don't delete
                private projectService:ProjectService,
                private chatService:ChatService,
                private router:Router){
    }

    changeMenuColour(color){
        this.menuColor = 'sidebar '+color;
    }


    ngOnInit(){
        this.subscription = this.profileService.profile$.subscribe(
            profile=>{
                this.profile = profile;
                localStorage.setItem('lastLogged',profile.email);
            }
        );
        this.profileService.getProfile();
        this.projectService.getProjects();
        this.chatService.getMessages().subscribe(res=>{
            this.chatService.addMessages(res.messages);
        });
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



    onLogout(){
        localStorage.removeItem('token');
        this.router.navigate(['/']);
    }

    ngOnDestroy() {
        if(this.subscription!==undefined)
        this.subscription.unsubscribe();
    }
}