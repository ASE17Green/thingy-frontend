import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { UserService, ThingyService, UserthingyService } from '../../shared/services/index';
import { User, Userthingy, ThingyData } from '../../shared/models/index';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    username: string;
    user = new User();
    dataNumber: number;
    lastThingy: ThingyData;
    userthingyStatus = 'Status unknown';
    showData = false;

    // alert settings
    config = new MatSnackBarConfig();

    constructor(private userService: UserService,
                private thingyService: ThingyService,
                private snackbar: MatSnackBar,
                private userthingyService: UserthingyService) {
        // alert settings
        this.config.extraClasses = ['snackbar-design'];
        this.config.duration = 3000;

    }

    ngOnInit() {
        this.userService.getUser().then(
            (userData: User) => {
                this.user = userData;
                return this.user;
            },
            error => {
                console.log('Something went wrong');
                return null;
            }).then(
            () => {
                if (this.user.userThingys) {
                    this.thingyService.getLastEntry(this.user.userThingys[0]).then(
                        (thingyData: ThingyData) => {
                            this.lastThingy = thingyData;
                        },
                        error => {
                            console.log('Something went wrong');
                        });
                }
            }
        ).then(
            () => {
                if (this.user.userThingys) {
                    this.thingyService.getThingyById(this.user.userThingys[0]).then(
                        (thingyData: ThingyData[]) => {
                            this.dataNumber = thingyData.length;
                        },
                        error => {
                            console.log('Something went wrong');

                        });
                }
            }
        ).then(
            () => {
                for (let userthingyId of this.user.userThingys) {
                    this.userthingyService.getUserthingyById(userthingyId).then(
                        (userThingy: Userthingy) => {
                            if (userThingy.packageArrivedMessageSent) {
                                this.userthingyStatus = 'Package arrived';
                            } else if (userThingy.thingyTemperatureMessageSent) {
                                this.userthingyStatus = 'Reached critical temperature';
                            } else if (this.dataNumber === 0) {
                                this.userthingyStatus = 'Ready for delivery';
                            } else {
                                this.userthingyStatus = 'On its way';
                            }
                        },
                        error => {
                            this.snackbar.open('Couldnt load userthingy');
                        });
                }
            }
        );
        this.username = JSON.parse(localStorage.getItem('user')).name;
    }

    onDeleteUserthingy(id: string) {
        this.userthingyService.deleteUserthingy(id).then(
            data => {
                this.snackbar.open('Thingy ' + id + ' was successfully deleted.', 'close', this.config);
                this.userService.getUser().then(
                    userdata => {
                        this.user = userdata;
                    },
                    error => {
                        this.snackbar.open('Something went wrong. Please contact an admin', 'close', this.config);
                    });
            },
            error => {
                console.log(error)
            });
    }

}
