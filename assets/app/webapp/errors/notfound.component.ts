import {Component} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {homeTransition} from "../content/home.animations";

@Component({
    selector: 'app-404-error',
    template:`        
        <div
                fxLayout
                fxLayout.xs="column"
                fxLayoutAlign="center"
                fxLayoutGap="10px"
                fxLayoutGap.xs="0">
            <div fxFlex="auto">
                <md-card class="card" >
                    <md-card-header>
                        <md-card-title>
                            404
                        </md-card-title>
                        <md-card-subtitle>
                            Oops ! It seems you're lost
                        </md-card-subtitle>
                    </md-card-header>
                    <md-card-content>
                        The page you are looking for, doesn't exist ... Yet !
                        <br>
                        <br>
                        <md-input-container>
                            <md-icon mdPrefix>search</md-icon>
                            <input mdInput placeholder="Search for something">
                        </md-input-container>
                    </md-card-content>
                    <md-card-footer>
                        <hr>
                        <md-icon>history</md-icon> Just updated
                    </md-card-footer>
                </md-card>
            </div>
        </div>
    `,
    styles: [`
        .card {
            text-align: center!important;
            border-radius: 6px!important;
            box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)!important;
        }
        .card:hover {
            box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.34), 0 6px 30px 5px rgba(0, 0, 0, 0.32), 0 8px 10px -5px rgba(0, 0, 0, 0.6)!important;
            transition: all 0.3s cubic-bezier(.25,.8,.25,1)!important;
        }
        /*
        .container:after {
            word-wrap:break-word;
        }*/

        .listItem:hover{
            background-color: gray;
            cursor : hand;
        }
    `],
    animations: [homeTransition],
    host:{'[@homeTransition]':''}
})
export class NotFoundErrorComponent{

    constructor(private titleService: Title){
        this.titleService.setTitle("404 Error");
    }
    ngOnDestroy(){
        this.titleService.setTitle("Project Management");
    }

}