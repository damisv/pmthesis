import {Component, HostListener} from "@angular/core";

@Component({
    selector: 'auth-nav',
    templateUrl: './authnav.component.html',
    styleUrls: ['./authnav.component.css']
})
export class AuthnavComponent {
    isTop:string = '';
    isTransparent:string = '';

    @HostListener('window:scroll', ['$event']) onScrollEvent($event){
        let scrollHeight = window.pageYOffset;
        let height = window.innerHeight;
        let desiredHeight = 0.2*height;
        if(scrollHeight <= desiredHeight){
            this.isTop = '';
            this.isTransparent = '';
        }else{
            this.isTop = 'transparent';
            this.isTransparent = 'black';
        }
    }

}