import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Account } from '../models/account';
import { Error } from "../models/error";
import {ProgressBarService} from "../webapp/_services/progressbar.service";
import {MatDialog, MatDialogConfig} from "@angular/material";
import {ErrorDialogComponent} from "../errors/error.component";

@Injectable()
export class AuthService {
    constructor(private http: Http,private progressBarService:ProgressBarService,private dialog: MatDialog) {}
    signInUrl = 'signin';
    signUpUrl = 'signup';
    error:Error;
    selectedOption;

    signUp(account : Account):Observable<any> {
        this.progressBarService.availableProgress();
        const body = JSON.stringify({account:account});
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('auth/signup', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.throwError(error.json());
                return Observable.throw(error.json());
            }).finally(()=>this.progressBarService.availableProgress());
    }
    signIn(account:Account):Observable<any> {
        this.progressBarService.availableProgress();
        const body = JSON.stringify({account:account});
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('auth/signin', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                    this.throwError(error.json());
                    return Observable.throw(error.json());
            }).finally(()=>this.progressBarService.availableProgress());
        // URL to web API
        /*return this.http.get(this.signInUrl)
         .map(response => response.json() as Account)
         .catch(this.handleError);*/
    }


    private throwError(error){
        const errorData = new Error(error.title, error.error.message);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = errorData;
        let dialogError = this.dialog.open(ErrorDialogComponent,dialogConfig);
        dialogError.afterClosed().subscribe(result => {
            this.selectedOption = result;
        });
    }

    private handleError (error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}