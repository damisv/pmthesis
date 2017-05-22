import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Account} from "../../models/account";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit{

    myForm: FormGroup;
    returnUrl: string;

    constructor(private authService: AuthService,private router: Router,private route: ActivatedRoute) {}

    onSubmit() {
        const account = new Account(this.myForm.value.email,this.myForm.value.password);
        this.authService.signIn(account)
            .subscribe(
                token => {
                    localStorage.setItem('token', token.token);
                    /*let user = {
                        email:token.email,
                        id:token.id,
                        profile:token.profile
                    };
                    localStorage.setItem('user',JSON.stringify(user));
                    localStorage.setItem('lastLogged',user.email);*/
                    this.router.navigate([this.returnUrl]);
                },
                error => console.error(error)
            );
        this.myForm.reset();
    }


    ngOnInit() {
        this.myForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            password: new FormControl(null, Validators.required)
        });
        localStorage.removeItem('token');
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/app';
    }
}