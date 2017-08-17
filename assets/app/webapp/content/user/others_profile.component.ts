import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ProfileService} from "../../_services/profile.service";
import {Profile} from "../../../models/profile";
import {Title} from "@angular/platform-browser";
import {Subscription} from "rxjs/Subscription";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';

@Component({
    selector: 'webapp-profile-others',
    templateUrl: './others_profile.component.html',
    styleUrls: ['./others_profile.component.css'],
    animations: [ trigger('homeTransition', [
        transition(':enter', [
            query('.card', style({ opacity: 0 })),
            query('.card', stagger(300, [
                style({ transform: 'translateY(100px)' }),
                animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(0px)', opacity: 1})),
            ])),
        ]),
        transition(':leave', [
            query('.card', stagger(300, [
                style({ transform: 'translateY(0px)', opacity: 1 }),
                animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(100px)', opacity: 0})),
            ])),
        ])
    ]) ],
    host: {
        '[@homeTransition]': ''
    }
})
export class OthersProfileComponent implements OnInit{

    private sub: any;
    profile:Profile = null;
    subscription: Subscription;


    constructor(private router: Router,private route: ActivatedRoute,private profileService: ProfileService,private titleService: Title){}

    ngOnInit(){
        this.subscription = this.profileService.profile$.subscribe(
            profile => {
                this.profile = profile;
                if(profile){
                    this.route.params.subscribe(params => {
                        if(params.id){
                            if(this.profile.email.match(params.id)) {
                                this.router.navigateByUrl('app/profile');
                            }else{
                                this.profileService.getOtherProfile(params.id).subscribe(
                                    data => {
                                        this.profile = data.profile;
                                        this.titleService.setTitle(this.profile.firstName+"'s profile");
                                    },
                                    error => console.error(error)
                                );
                            }
                        }
                    });
                }
            });


    }

    ngOnDestroy(){
        if(this.sub!==undefined)
        this.sub.unsubscribe();
        this.titleService.setTitle("Project Management");
    }
}