import {Component} from "@angular/core";
import {Title} from "@angular/platform-browser";

@Component({
    selector: 'app-404-error',
    template:`        
        <div class="col-md-16" style="text-align:center;">
            <div class="card">
                <div class="header" >
                    <h2 class="title">404</h2><h4 class="title">Oops ! It seems you're lost</h4>
                </div>
                <div class="content">
                    The page you are looking for, doesn't exist ... Yet ! 
                    <br>
                    <br>
                    <md-input-container>
                        <input mdInput type="text" placeholder="Search for something">
                    </md-input-container>
                    <md-icon>search</md-icon>
                </div>
            </div>
        </div>
        
    `,
    styles: [`
        .card {
            border-radius: 6px;
            box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
        }
    `]
})
export class NotFoundErrorComponent{

    constructor(private titleService: Title){
        this.titleService.setTitle("404 Error");
    }

    ngOnDestroy(){
        this.titleService.setTitle("Project Management");
    }

}