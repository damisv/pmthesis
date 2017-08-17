import { Injectable } from '@angular/core';
import {Router,ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild} from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AppGuard implements CanActivateChild {

    constructor(private router: Router) { }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (tokenNotExpired('token')) {
           return true;
        }else{
            if(localStorage.getItem('lastLogged')){
                this.router.navigate(['/auth/lock'], {queryParams: { returnUrl: state.url }});
                return false;
            }
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/auth/signin'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}