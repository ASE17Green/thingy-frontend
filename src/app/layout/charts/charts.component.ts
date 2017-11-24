import {Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {ThingyService} from '../../shared/services/index';
import {ThingyData} from '../../shared/models/thingy-data';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import { RouterModule, Routes, Router, NavigationStart } from '@angular/router';
import * as d3 from 'd3';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    animations: [routerTransition()],
})
export class ChartsComponent implements OnInit, OnChanges {
    thingyData: ThingyData[];
    randomThingy = new ThingyData();

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

    }

    ngOnChanges() {

    }

    RandomizeGauge(): void {
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

        this.thingyService.getThingyDataComplete().then(
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

    createNewThingy(): void {
        // alert settings
        let config = new MatSnackBarConfig();
        config.extraClasses = ['snackbar-design'];
        config.duration = 3000;

        // generate random testdata
        this.randomThingy.color = this.randomNumberFromInterval(1, 255);
        this.randomThingy.date = new Date();
        this.randomThingy.gravity = this.randomNumberFromInterval(0, 9.81);
        this.randomThingy.humidity = this.randomNumberFromInterval(0, 100);
        this.randomThingy.temperature = this.randomNumberFromInterval(0, 40);
        this.randomThingy.gas = this.randomNumberFromInterval(0, 50);
        this.randomThingy.pressure = this.randomNumberFromInterval(0, 50);

        this.thingyService.createNewThingyDataset(this.randomThingy).then(
            data => {
                const jsonData = JSON.parse(JSON.stringify(data));
                // this is just for testing
                this.snackbar.open('New ThingyData added', 'close', config);
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
