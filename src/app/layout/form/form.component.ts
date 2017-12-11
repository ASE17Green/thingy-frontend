import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { UserService, ThingyService, UserthingyService} from '../../shared/services/index';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ThingyData, Userthingy, User } from '../../shared/models/index'

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    animations: [routerTransition()]
})
export class FormComponent implements OnInit {
    user: User = new User();
    userthingyForm: FormGroup;
    userthingys: Userthingy[];

    config = new MatSnackBarConfig();

    constructor(private userService: UserService,
                private userthingyService: UserthingyService,
                private fb: FormBuilder,
                private snackbar: MatSnackBar,
                public router: Router) {
        this.config.extraClasses = ['snackbar-design'];
        this.config.duration = 3000;

        this.createForm();
    }
    ngOnInit() {
        this.userService.getUser().then(
            (userData: User) => {
                this.user = userData;
                console.log('userthingys of user: ' + userData.userThingys);
                console.log('number of userthingys: ' + userData.userThingys.length);
            },
            error => {
                console.log('Something went wrong');
            }).then(
            () => {
                if (this.user.userThingys) {
                    console.log('userthingys request: ' + this.user.userThingys);
                    for (let thingysID of this.user.userThingys) {
                        console.log('thingy id request: ' + thingysID);
                        this.userthingyService.getUserthingyById(thingysID).then(
                            (userthingy: Userthingy) => {
                                if(this.userthingys){
                                    this.userthingys.push(userthingy);
                                } else {
                                    this.userthingys = [userthingy];
                                }

                            },
                            error => {
                                console.log('Something went wrong');
                            });
                    }
                }
            }
        );
    }

    createForm() {
        this.userthingyForm = this.fb.group({
            thingyID: ['', Validators.required],
            thingyMinTemperature: ['', Validators.required],
            thingyMaxTemperature: ['', Validators.required],
            endLatitude: ['', Validators.required],
            endLongitude: ['', Validators.required],
        });
    }

    onSetIntervals() {
        for (let userthingy of this.userthingys) {
            this.userthingyService.updateUserthingy(userthingy).then(
                data => {
                    const jsonData = JSON.parse(JSON.stringify(data));
                    if (jsonData.success) {
                        this.snackbar.open('Thingy successfully updated', 'close', this.config);
                        this.userthingyForm.reset();
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
}
