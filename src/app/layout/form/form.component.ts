import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { UserService} from '../../shared/services/index';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { User } from '../../shared/models/user';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    animations: [routerTransition()]
})
export class FormComponent implements OnInit {
    user: User = new User();
    intervalForm: FormGroup;

    config = new MatSnackBarConfig();

    constructor(private userService: UserService,
                private fb: FormBuilder,
                private snackbar: MatSnackBar,
                public router: Router) {
        this.config.extraClasses = ['snackbar-design'];
        this.config.duration = 3000;

        this.createForm();
    }
    ngOnInit() {
        this.userService.getUser().then(
            data => {
                this.user = data;
            },
            error => {
                this.snackbar.open('Something went wrong. Please contact an admin', 'close', this.config);
                this.router.navigate(['/login']);
            });
    }

    createForm() {
        this.intervalForm = this.fb.group({
            thingyMaxTemp: [''],
            thingyMinTemp: ['']
        });
    }

    onSetIntervals() {

        this.userService.updateUser(this.user).then(
            data => {
                const jsonData = JSON.parse(JSON.stringify(data));
                if (jsonData.success) {
                    this.snackbar.open('Thingy successfully added', 'close', this.config);
                    this.intervalForm.reset();
                    // update User
                } else {
                    console.log('fail: ' + jsonData.msg);
                    this.snackbar.open(jsonData.msg, 'close', this.config);
                }
            },
            error => {
                console.log('Something went wrong');
                this.snackbar.open('Something went wrong. Please contact an admin', 'close', this.config);
                this.router.navigate(['/login']);
            });

    }
}
