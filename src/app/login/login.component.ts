import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { UserService} from '../shared/services/index';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { User } from '../shared/models/user';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;

    user: User = new User();

    constructor(private userService: UserService,
                private fb: FormBuilder,
                private snackbar: MatSnackBar,
                public router: Router) {

        this.createForm();
    }

    ngOnInit() {
    }

    createForm() {
        this.loginForm = this.fb.group({
            name: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onLoggedin() {
        // alert settings
        let config = new MatSnackBarConfig();
        config.extraClasses = ['snackbar-design'];
        config.duration = 3000;

        this.userService.authenticateUser(this.user).then(
            data => {
                const jsonData = JSON.parse(JSON.stringify(data));
                const test = JSON.stringify(data);
                if (jsonData.success) {
                    console.log('success: ' + jsonData.msg);
                    console.log('token: ' + jsonData.token);
                    this.userService.storeUserData(jsonData.token, jsonData.user)
                    this.snackbar.open('Welcome, ' + this.user.name, 'close', config);
                    this.router.navigate(['/dashboard']);
                } else {
                    console.log('fail: ' + jsonData.msg);
                    this.snackbar.open(jsonData.msg, 'close', config);
                    this.router.navigate(['/login']);
                }
            },
            error => {
                console.log('Something went wrong');
                this.snackbar.open('Something went wrong. Please contact an admin', 'close', config);
                this.router.navigate(['/login']);
            });

    }

}
