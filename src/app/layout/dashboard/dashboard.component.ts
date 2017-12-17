import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { UserService, ThingyService, UserthingyService } from '../../shared/services/index';
import { User, Userthingy, ThingyData } from '../../shared/models/index';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    username: string;
    user = new User();
    userthingys: Userthingy[] = [];
    thingyEntries = [];

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
                    this.userthingyService.getUserthingys().then(
                        (userThingys: Userthingy[]) => {
                            this.userthingys = userThingys;
                            for(let userthingy of this.userthingys){
                                this.loadThingydata(userthingy.thingyID);
                            }
                        },
                        error => {
                            this.snackbar.open('Couldnt load userthingy');
                        });
            }
        );
        this.username = JSON.parse(localStorage.getItem('user')).name;
    }

    returnStatus(userThingy: Userthingy): string {
        if (userThingy.packageArrivedMessageSent) {
            return 'Package arrived';
        } else if (userThingy.thingyTemperatureMessageSent) {
            return 'Reached critical temperature';
        } else if (userThingy.packageStartedMessageSent) {
            return 'On its way';
        } else {
            return'Ready for delivery';
        }
    }

    loadThingydata(id: string) {
        this.thingyService.getThingyById(id).then(
            (thingyData: ThingyData[]) => {
                let thingyEntry = {thingyID: id, thingyEntries: thingyData.length};
                this.thingyEntries.push(thingyEntry);
            },
            error => {
                this.snackbar.open('Couldnt load userthingy');
            });
    }

    getThingyEntries(id: string): string {
        console.log(id);
        let result = this.thingyEntries.filter(function( obj ) {
            return obj.thingyID === id;
        });
        if (result[0]) {
            return result[0].thingyEntries;
        }else {
            return '0';
        }

    }

    onDeleteUserthingy(id: string) {
        this.userthingyService.deleteUserthingy(id).then(
            data => {
                this.snackbar.open('Thingy ' + id + ' was successfully deleted.', 'close', this.config);
                this.userService.getUser().then(
                    userdata => {
                        this.user = userdata;
                        this.ngOnInit();
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
