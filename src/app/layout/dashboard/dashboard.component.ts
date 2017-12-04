import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { UserService, ThingyService } from '../../shared/services/index';
import {ThingyData} from '../../shared/models/thingy-data';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    username: string;
    dataNumber: number;
    lastThingy: ThingyData;

    constructor(private userService: UserService,
                private thingyService: ThingyService) {

    }

    ngOnInit() {
        this.thingyService.getLastEntry().then(
            (thingyData: ThingyData) => {
                this.lastThingy = thingyData;
            },
            error => {
                console.log('Something went wrong');

            });
        this.thingyService.getThingyById('EB:10:8E:F0:E0:C3').then(
            (thingyData: ThingyData[]) => {
                this.dataNumber = thingyData.length;
            },
            error => {
                console.log('Something went wrong');

            });
        this.username = JSON.parse(localStorage.getItem('user')).name;
    }
}
