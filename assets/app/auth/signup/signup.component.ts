import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Account} from "../../models/account";
import {Router} from "@angular/router";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{
    myForm: FormGroup;

    constructor(private authService: AuthService,private router:Router) {}

    onSubmit() {
        const account = new Account(
            this.myForm.value.email,
            this.myForm.value.password
        );
        this.authService.signUp(account)
            .subscribe(
                data => {
                    this.router.navigateByUrl('/auth/signin');
                },
                error => {}//console.error(error)
            );
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            password: new FormControl(null, Validators.required),
            repassword: new FormControl(null, Validators.required)
        });
    }
}