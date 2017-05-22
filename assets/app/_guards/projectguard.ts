import {Injectable, OnInit} from '@angular/core';
import {Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate} from '@angular/router';

@Injectable()
export class ProjectGuard implements CanActivate {

    constructor(private router: Router){
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

            //TODO:here should check if the user has admin rights

        /*
        the following code is just a sample so that settings route always work
         */
        let manager = true;
        if(manager){
            return true;
        }else{
            this.router.navigate(['/app']);
            return false;
        }
    }

    ngOnInit(){
    }

}