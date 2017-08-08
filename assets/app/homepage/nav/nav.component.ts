import {AfterViewInit, Component, HostListener} from "@angular/core";
import {ObservableMedia} from "@angular/flex-layout";
import {runInThisContext} from "vm";

@Component({
    selector: 'my-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements AfterViewInit{
    isTop:string = '';
    isTransparent:string = '';
    isMobile:boolean;

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
    };

    constructor(private media:ObservableMedia){}

    ngAfterViewInit(){
        this.menuMobile();
        this.media.subscribe((change) => {
            this.menuMobile();
        });
    }

    menuMobile(){
         if (this.media.isActive('sm')) {
            this.isMobile = true;
        }
        else if (this.media.isActive('xs')) {
            this.isMobile=true;
        }
        else{
            this.isMobile=false;
        }
    }
}