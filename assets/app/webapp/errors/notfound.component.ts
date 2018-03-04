import {Component} from "@angular/core";
import {Title} from "@angular/platform-browser";
import {trigger, stagger, animate, style, group, query, transition, keyframes} from '@angular/animations';

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
                <mat-card class="card" >
                    <mat-card-header>
                        <mat-card-title>
                            404
                        </mat-card-title>
                        <mat-card-subtitle>
                            Oops ! It seems you're lost
                        </mat-card-subtitle>
                    </mat-card-header>
                    <mat-card-content>
                        The page you are looking for, doesn't exist ... Yet !
                        <br>
                        <br>
                        <mat-input-container>
                            <mat-icon matPrefix>search</mat-icon>
                            <input matInput placeholder="Search for something">
                        </mat-input-container>
                    </mat-card-content>
                    <mat-card-footer>
                        <hr>
                        <mat-icon>history</mat-icon> Just updated
                    </mat-card-footer>
                </mat-card>
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

    `],
    animations: [ trigger('homeTransition', [
        transition(':enter', [
            query('.card', style({ opacity: 0 })),
            query('.card', stagger(300, [
                style({ transform: 'translateY(100px)' }),
                animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(0px)', opacity: 1})),
            ])),
        ]),
        transition(':leave', [
            query('.card', stagger(300, [
                style({ transform: 'translateY(0px)', opacity: 1 }),
                animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(100px)', opacity: 0})),
            ])),
        ])
    ]) ],
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