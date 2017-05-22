import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ProfileService} from "../../_services/profile.service";
import {Profile} from "../../../models/profile";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'webapp-profile-others',
    templateUrl: './others_profile.component.html',
    styleUrls: ['./others_profile.component.css']
})
export class OthersProfileComponent implements OnInit{

    user = JSON.parse(localStorage.getItem('user'));
    id:number;
    email:string;
    private sub: any;
    profile:Profile= new Profile('email');


    constructor(private router: Router,private route: ActivatedRoute,private profileService: ProfileService,private titleService: Title){}

    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
           //this.id = +params['id'];
            this.email = params['id'];
        });
        if(this.email.match(this.user.email)) {
            this.router.navigateByUrl('app/profile');
        }else{
            this.profileService.getOtherProfile(this.email).subscribe(
                data => {
                    this.profile = data.profile;
                    this.titleService.setTitle(this.profile.firstName+"'s profile");
                },
                error => console.error(error)
            );
        }
    }

    ngOnDestroy(){
        if(this.sub!==undefined)
        this.sub.unsubscribe();
        this.titleService.setTitle("Project Management");
    }
}