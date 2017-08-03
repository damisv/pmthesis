import {Component, HostListener} from "@angular/core";

@Component({
    selector: 'my-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent {
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

    constructor(){}
}