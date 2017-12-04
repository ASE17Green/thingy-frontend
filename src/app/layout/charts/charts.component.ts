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
    thingyData: ThingyData[];
    randomThingy = new ThingyData();

    key: string = 'date';
    reverse: boolean = false;

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

    gaugeType = "arch";
    gaugeValue = 28.3;
    gaugeLabel = "Flurins";
    gaugeAppendText = "m/s";
    thresholdConfig = {
        '0': {color: 'red'},
        '10': {color: 'orange'},
        '20': {color: 'green'},
        '80': {color: 'orange'},
        '90': {color: 'red'}
    };

    constructor(private thingyService: ThingyService,
                private snackbar: MatSnackBar,
                private router: Router) {
        let refreshInterval = setInterval(() => { this.refreshData(); }, 1000);
        router.events.forEach((event) => {
            if (event instanceof NavigationStart) {
                clearInterval(refreshInterval);
            }
        });
    }

    ngOnInit() {
        this.latMap = this.latMarker = this.randomNumberFromInterval(40, 50);
        this.lngMap = this.lngMarker = this.randomNumberFromInterval(7, 8);
        this.getAllData();

    }

    ngOnChanges() {

    }

    sort(key){
        this.key = key;
        this.reverse = !this.reverse;
    }

    RandomizeGauge(): void {
        $('#test').hide();

        this.gaugeValue = this.randomNumberFromInterval(0, 100);
        this.latMarker += this.randomNumberFromInterval(-1, 1) / 1000;
        this.lngMarker += this.randomNumberFromInterval(-1, 1) / 1000;
    }

    refreshData(): void {
        console.log('works');
    }

    getAllData(): void {
        // alert settings
        let config = new MatSnackBarConfig();
        config.extraClasses = ['snackbar-design'];
        config.duration = 3000;

        this.thingyService.getThingyById('EB:10:8E:F0:E0:C3').then(
            (thingyData: ThingyData[]) => {
                this.thingyData = thingyData;
                console.log(this.thingyData);
                this.snackbar.open('Request successful', 'close', config);
            },
            error => {
                console.log('Something went wrong');
                /*
                 this.snackbar.open('Something went wrong. Please contact an admin', 'close', config);
                 this.router.navigate(['/signup']);
                 */
            });
    }


    randomNumberFromInterval(min: number, max: number): number {
        // returns a random number rounded to two decimals between min and max
        return Math.round((Math.random() * (max - min + 1) + min) * 100) / 100;
    }


}
