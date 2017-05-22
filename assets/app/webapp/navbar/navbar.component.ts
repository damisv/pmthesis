import {Component, Input, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Profile} from "../../models/profile";
import {MdMenu, MdMenuTrigger} from "@angular/material";

@Component({
    selector: 'webapp-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})

export class NavbarComponent{
    @Input() profile:Profile;

    constructor(private router: Router){}

    settings = [
        {value: 'setting_1',viewValue: 'View Account Security'},
        {value: 'setting_2',viewValue: 'Notifications Settings'},
        {value: 'help',viewValue: 'Help'},
    ];

    onLogout(){
        localStorage.removeItem('token');
        this.router.navigate(['/']);
    }

}
