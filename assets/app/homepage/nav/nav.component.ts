import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'my-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent {
    constructor(private route: ActivatedRoute){}

    onAnchorClick(){
        this.route.fragment.subscribe ( f => {
         const element = document.querySelector( "#" + f )
            if( element ) element.scrollIntoView(element)
        });
    }
}