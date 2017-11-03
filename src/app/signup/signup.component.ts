import { Component, OnInit, OnChanges } from '@angular/core';
import { routerTransition } from '../router.animations';
import { UserService} from '../shared/services/index';
import { User } from '../shared/models/user';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {

    userForm: FormGroup;

    user: User = new User();

    constructor(private userService: UserService,
                private fb: FormBuilder,
                private snackbar: MatSnackBar,
                private router: Router) {

        this.createForm();
    }

    ngOnInit() {
    }

    createForm() {
        this.userForm = this.fb.group({
            name: ['', Validators.required],
            password: ['', Validators.required],
            passwordRepeat: ['', Validators.required]
        }, {validator: this.matchingFields('password', 'passwordRepeat')});
    }

    matchingFields(fieldKey: string, fieldRepeatKey: string) {
        return (group: FormGroup) => {
            let fieldInput = group.controls[fieldKey];
            let fieldRepeatInput = group.controls[fieldRepeatKey];
            if (fieldInput.value !== fieldRepeatInput.value) {
                return fieldRepeatInput.setErrors({notEquivalent: true})
            }
        }
    }


    submit() {
        // alert settings
        let config = new MatSnackBarConfig();
        config.extraClasses = ['snackbar-design'];
        config.duration = 3000;

        this.userService.createUser(this.user).then(
            data => {
                const jsonData = JSON.parse(JSON.stringify(data));
                if (jsonData.success) {
                    console.log('success: ' + jsonData.msg);
                    this.snackbar.open('User successfully created', 'close', config);
                    this.router.navigate(['/login']);
                } else {
                    console.log('fail: ' + jsonData.msg);
                    this.snackbar.open(jsonData.msg, 'close', config);
                    this.router.navigate(['/signup']);
                }
            },
            error => {
                console.log('Something went wrong');
                this.snackbar.open('Something went wrong. Please contact an admin', 'close', config);
                this.router.navigate(['/signup']);
            });

    }
}
