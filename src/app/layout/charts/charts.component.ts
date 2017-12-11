import {Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {ThingyService, UserService} from '../../shared/services/index';
import {ThingyData} from '../../shared/models/thingy-data';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import { RouterModule, Routes, Router, NavigationStart } from '@angular/router';
import { User } from '../../shared/models/user';
import * as d3 from 'd3';

import * as $ from 'jquery';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    animations: [routerTransition()],
})
export class ChartsComponent implements OnInit, OnChanges {
    user: User;
    thingyData: ThingyData[];
    lastThingy: ThingyData;

    // alert settings
    config = new MatSnackBarConfig();

    // table sorting and pagination stuff
    key: string = 'date';
    reverse: boolean = false;
    p: number = 1;

    title: string = 'My first AGM project';
    latMap: number = 51.678418;
    lngMap: number = 7.809007;

    latMarker: number = 51.678418;
    lngMarker: number = 7.809007;

    latPoly1: number = 51.678418;
    latPoly2: number = 50.678418;
    latPoly3: number = 49.878418;
    lngPoly1: number = 7.809007;
    lngPoly2: number = 8.909007;
    lngPoly3: number = 9.309007;

    gaugeDefType = "arch";
    gaugeDefValue = 28;
    gaugeDefLabel = "Flurins";
    gaugeDefAppendText = "m/s";
    gaugeDefThresholdConfig = {
        '0': {color: 'red'},
        '10': {color: 'orange'},
        '20': {color: 'green'},
        '80': {color: 'orange'},
        '90': {color: 'red'}
    };

    gaugeTempValue = 0;
    gaugeTempLabel = "Temperature";
    gaugeTempAppendText = "°C";
    gaugeTempThresholdConfig = {
        '0': {color: 'red'},
        '10': {color: 'orange'},
        '20': {color: 'green'},
        '80': {color: 'orange'},
        '90': {color: 'red'}
    };

    gaugePressValue = 0;
    gaugePressLabel = "Pressure";
    gaugePressAppendText = "Pascal";

    gaugeHumValue = 0;
    gaugeHumLabel = "Humidity";
    gaugeHumAppendText = "%";



    constructor(private thingyService: ThingyService,
                private userService: UserService,
                private snackbar: MatSnackBar,
                private router: Router) {
        // alert settings
        this.config.extraClasses = ['snackbar-design'];
        this.config.duration = 3000;

        this.getAllData();

        const refreshInterval = setInterval(() => { this.refreshData(); }, 5000);
        router.events.forEach((event) => {
            if (event instanceof NavigationStart) {
                clearInterval(refreshInterval);
            }
        });
    }

    ngOnInit() {

        this.latMap = this.latMarker = this.randomNumberFromInterval(40, 50);
        this.lngMap = this.lngMarker = this.randomNumberFromInterval(7, 8);

    }

    ngOnChanges() {

    }

    sort(key){
        this.key = key;
        this.reverse = !this.reverse;
    }

    initGraphs(): void {
        if(this.lastThingy){
            this.gaugeTempValue = this.lastThingy.temperature;
            this.gaugePressValue = this.lastThingy.pressure;
            this.gaugeHumValue = this.lastThingy.humidity;
        }
    }

    RandomizeGauge(): void {
        this.latMarker += this.randomNumberFromInterval(-1, 1) / 1000;
        this.lngMarker += this.randomNumberFromInterval(-1, 1) / 1000;
    }

    refreshData(): void {
        // EB:10:8E:F0:E0:C3
        // this.user.thingysID[0]

        if (this.user.userThingys) {
            this.thingyService.getThingyById(this.user.userThingys[0]).then(
                (thingyData: ThingyData[]) => {
                    this.thingyData = thingyData;
                    // filter empty date columns
                    this.thingyData = this.thingyData.filter(function(n){ return n.date != undefined });
                    this.snackbar.open('Request successful', 'close', this.config);
                },
                error => {
                    this.snackbar.open('No thingy data available.', 'close', this.config);
                }).then(
                () => {
                    this.thingyService.getLastEntry(this.user.userThingys[0]).then(
                        (thingyData: ThingyData) => {
                            this.lastThingy = thingyData;
                        },
                        error => {
                            console.log('Something went wrong');
                        });
                }
            );
        }
    }

    getAllData(): void {
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
                if (this.user.userThingys) {
                    this.thingyService.getLastEntry(this.user.userThingys[0]).then(
                        (thingyData: ThingyData) => {
                            this.lastThingy = thingyData;
                            this.initGraphs();
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
                            this.thingyData = thingyData;
                            this.snackbar.open('Request successful', 'close', this.config);
                        },
                        error => {
                            console.log('Something went wrong');
                            this.snackbar.open('No thingy data available.', 'close', this.config);
                        });
                }
            }
        );
    }


    randomNumberFromInterval(min: number, max: number): number {
        // returns a random number rounded to two decimals between min and max
        return Math.round((Math.random() * (max - min + 1) + min) * 100) / 100;
    }


}
