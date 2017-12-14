import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { UserService, UserthingyService } from '../../shared/services/index';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { User, Userthingy } from '../../shared/models/index';

declare const jQuery: any;

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.scss'],
    animations: [routerTransition()]
})
export class TablesComponent implements OnInit {
    config = new MatSnackBarConfig();

    newThingyForm: FormGroup;

    userthingy = new Userthingy();

    user: User = new User();

    constructor(private userService: UserService,
                private userthingyService: UserthingyService,
                private fb: FormBuilder,
                private snackbar: MatSnackBar,
                public router: Router) {
        this.createForm();
    }
    ngOnInit() {
        // alert settings
        this.config.extraClasses = ['snackbar-design'];
        this.config.duration = 3000;

        // get user profile
        //this.user = JSON.parse(localStorage.getItem('user'));


        this.userService.getUser().then(
            data => {
                this.user = data;
                console.log('this.user: ' + this.user.userThingys);
            },
            error => {
                this.snackbar.open('Something went wrong. Please contact an admin', 'close', this.config);
                this.router.navigate(['/login']);
            });
    }

    createForm() {
        this.newThingyForm = this.fb.group({
            thingyID: ['', Validators.required],
            thingyMinTemperature: ['', Validators.required],
            thingyMaxTemperature: ['', Validators.required],
            endLatitude: ['', Validators.required],
            endLongitude: ['', Validators.required],
        });
    }

    onAddThingy() {
        this.userthingyService.addUserthingy(this.userthingy).then(
            data => {
                const jsonData = JSON.parse(JSON.stringify(data));
                if (jsonData.success === undefined) {
                    this.snackbar.open('Thingy successfully added', 'close', this.config);
                    this.newThingyForm.reset();
                } else {
                    this.snackbar.open(jsonData.msg, 'close', this.config);
                }

            },
            error => {
                console.log('Something went wrong');
                this.snackbar.open('Something went wrong. Please contact an admin', 'close', this.config);
                this.router.navigate(['/login']);
            }).then(
            () => {
                this.userService.getUser().then(
                    data => {
                        this.user = data;
                    },
                    error => {
                        this.snackbar.open('Something went wrong. Please contact an admin', 'close', this.config);
                        this.router.navigate(['/login']);
                    });
            }
        );

    }

    onDeleteUserthingy(id: string) {
        this.userthingyService.deleteUserthingy(id).then(
            data => {
                console.log('userthingy deleted');
                this.userService.getUser().then(
                    userdata => {
                        this.user = userdata;
                    },
                    error => {
                        this.snackbar.open('Something went wrong. Please contact an admin', 'close', this.config);
                        this.router.navigate(['/login']);
                    });
            },
            error => {
                console.log(error)
            });
    }
}
