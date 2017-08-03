import {Component} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Account} from "../../models/account";

@Component({
    selector: 'app-lockscreen',
    templateUrl: './lock.component.html',
    styleUrls: ['./lock.component.css']
})
export class LockComponent {

    email;

    myForm: FormGroup;

    returnUrl: string;

    constructor(private authService: AuthService,private router: Router,private route: ActivatedRoute) {
    }

    onSubmit() {
        const account = new Account(this.myForm.value.email,this.myForm.value.password);
        this.authService.signIn(account)
            .subscribe(
                token => {
                    localStorage.setItem('token', token.token);
                    this.router.navigate([this.returnUrl]);
                },
                error => console.error(error)
            );
        this.myForm.reset();
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            email: new FormControl({value: this.email,disabled: true},[
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            password: new FormControl(null, Validators.required)
        });
        localStorage.removeItem('token');
        this.email = localStorage.getItem('lastLogged');
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/app';
    }

}