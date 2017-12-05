import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { UserService, ThingyService } from '../../shared/services/index';
import { ThingyData } from '../../shared/models/thingy-data';
import { User } from '../../shared/models/user';

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

    constructor(private userService: UserService,
                private thingyService: ThingyService) {

    }

    ngOnInit() {
        this.userService.getUser().then(
            (userData: User) => {
                this.user = userData;
                console.log('inside: ' + this.user);
                return this.user;
            },
            error => {
                console.log('Something went wrong');
                return null;
            }).then(
            () => {
                if (this.user.thingysID) {
                    this.thingyService.getLastEntry(this.user.thingysID[0]).then(
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
                if (this.user.thingysID) {
                    this.thingyService.getThingyById(this.user.thingysID[0]).then(
                        (thingyData: ThingyData[]) => {
                            this.dataNumber = thingyData.length;
                        },
                        error => {
                            console.log('Something went wrong');

                        });
                }
            }
        );

        this.username = JSON.parse(localStorage.getItem('user')).name;
    }

}
