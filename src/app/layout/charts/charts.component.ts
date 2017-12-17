import {Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {ThingyService, UserService, UserthingyService} from '../../shared/services/index';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';
import { RouterModule, Routes, Router, NavigationStart } from '@angular/router';
import { Userthingy, User, ThingyData } from '../../shared/models/index'
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
    userthingys: Userthingy[];
    userthingy: Userthingy;
    userthingyA: Userthingy;

    graphPoints = 60;
    showGraphs = false;
    showTempGraph = false;
    showPresGraph = false;
    showHumGraph = false;
    showEco2Graph = false;

    lastThingyDate: Date;

    // alert settings
    config = new MatSnackBarConfig();

    // table sorting and pagination stuff
    key: string = 'date';
    reverse: boolean = true;
    p: number = 1;

    title: string = 'Current Thingy Position';
    latMap: number = 0;
    lngMap: number = 0;

    latMarker: number = 0;
    lngMarker: number = 0;

    dest_lat1 = 0;
    dest_lat2 = 0;
    dest_lng1 = 0;
    dest_lng2 = 0;

    gaugeDefType = "arch";
    gaugeDefValue = 0;
    gaugeDefLabel = "-";
    gaugeDefAppendText = "-";
    gaugeDefThresholdConfig = {
        '0': {color: 'red'},
        '10': {color: 'orange'},
        '20': {color: 'green'},
        '80': {color: 'orange'},
        '90': {color: 'red'}
    };

    gaugePressThresholdConfig = {
        '600': {color: 'red'},
        '800': {color: 'orange'},
        '900': {color: 'green'},
        '1000': {color: 'orange'},
        '1100': {color: 'red'}
    };

    gaugeEco2ThresholdConfig = {
        '100': {color: 'red'},
        '200': {color: 'orange'},
        '300': {color: 'green'},
        '600': {color: 'orange'},
        '700': {color: 'red'}
    };

    gaugeTempValue = 0;
    gaugeTempMinValue = 0;
    gaugeTempMaxValue = 100;
    gaugeTempLabel = "Temperature";
    gaugeTempAppendText = "°C";
    gaugeTempThresholdConfig = {};

    gaugePressValue = 0;
    gaugePressLabel = "Pressure";
    gaugePressAppendText = "Pa";

    gaugeHumValue = 0;
    gaugeHumLabel = "Humidity";
    gaugeHumAppendText = "%";

    gaugeEcoValue = 0;
    gaugeEcoLabel = "CO₂";
    gaugeEcoAppendText = "ppm";

    rgbaColor = 'rgba(0, 0, 0, 0)';

    /*______________ line chart data __________________*/

    public lineChartLabels: Array<any> = [];
    public lineChartOptions: any = {
        responsive: true
    };
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';
    public accelChartData: Array<any> = [
        { data: [], label: 'Acceleration X' },
        { data: [], label: 'Acceleration Y' },
        { data: [], label: 'Acceleration Z' }
    ];
    public polylineData: Array<any>;
    public tempChartData: Array<any> = [
        { data: [], label: 'Temperature [°C]' }
    ];
    public presChartData: Array<any> = [
        { data: [], label: 'Pressure [Pa]' }
    ];
    public humChartData: Array<any> = [
        { data: [], label: 'Humidity [%]' }
    ];
    public eco2ChartData: Array<any> = [
        { data: [], label: 'Eco2' }
    ];

    public accelChartColors: Array<any> = [
        {
            // red
            backgroundColor: 'rgba(192, 57, 43,0.2)',
            borderColor: 'rgba(192, 57, 43,1)',
            pointBackgroundColor: 'rgba(192, 57, 43,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(192, 57, 43,0.8)'
        },
        {
            // blue
            backgroundColor: 'rgba(41, 128, 185,0.2)',
            borderColor: 'rgba(41, 128, 185,1)',
            pointBackgroundColor: 'rgba(41, 128, 185,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(41, 128, 185,1)'
        },
        {
            // green
            backgroundColor: 'rgba(39, 174, 96,0.2)',
            borderColor: 'rgba(39, 174, 96,1)',
            pointBackgroundColor: 'rgba(39, 174, 96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(39, 174, 96,0.8)'
        }
    ];

    public lineChartColors: Array<any> = [
        {
            // black
            backgroundColor: 'rgba(0, 0, 0,0.2)',
            borderColor: 'rgba(0, 0, 0,1)',
            pointBackgroundColor: 'rgba(0, 0, 0,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0, 0, 0,0.8)'
        }
    ];


    constructor(private thingyService: ThingyService,
                private userService: UserService,
                private snackbar: MatSnackBar,
                private userthingyService: UserthingyService,
                private router: Router) {
        // alert settings
        this.config.extraClasses = ['snackbar-design'];
        this.config.duration = 3000;

        this.getAllData();

        const refreshInterval = setInterval(() => { this.refreshData(); }, 2000);
        router.events.forEach((event) => {
            if (event instanceof NavigationStart) {
                clearInterval(refreshInterval);
            }
        });
    }

    ngOnInit() {
        /*
        this.latMap = this.latMarker = this.randomNumberFromInterval(40, 50);
        this.lngMap = this.lngMarker = this.randomNumberFromInterval(7, 8);
        */
    }

    ngOnChanges() {

    }

    sort(key){
        this.key = key;
        this.reverse = !this.reverse;
    }

    initLastThingyData(): void {
        // map
        this.latMap = this.lastThingy.latitude;
        this.lngMap = this.lastThingy.longitude;
        this.latMarker = this.lastThingy.latitude;
        this.lngMarker = this.lastThingy.longitude;

        // gauges
        this.gaugeTempValue = this.lastThingy.temperature;
        this.gaugePressValue = this.lastThingy.pressure;
        this.gaugeHumValue = this.lastThingy.humidity;
        this.gaugeEcoValue = this.lastThingy.eco2;

        // color
        let colorMax = Math.max(this.lastThingy.colorRed, this.lastThingy.colorGreen, this.lastThingy.colorBlue);

        this.rgbaColor = 'rgba('
            + Math.round(this.lastThingy.colorRed / colorMax * 255)
            + ','
            + Math.round(this.lastThingy.colorGreen / colorMax * 255)
            + ','
            + Math.round(this.lastThingy.colorBlue / colorMax * 255)
            + ','
            + 1
            + ')';
    }

    initUserthingyData(): void {
        // temperature intervals
        if (this.userthingy) {
            let minTemp = this.userthingy.thingyMinTemperature;
            let maxTemp = this.userthingy.thingyMaxTemperature;
            this.gaugeTempMinValue = minTemp - 10;
            this.gaugeTempMaxValue = maxTemp + 10;
            let gaugeTempThreshold = {};

            gaugeTempThreshold[minTemp - 10] = {color: 'red'};
            gaugeTempThreshold[minTemp] = {color: 'orange'};
            gaugeTempThreshold[minTemp + 5] = {color: 'green'};
            gaugeTempThreshold[maxTemp - 5] = {color: 'orange'};
            gaugeTempThreshold[maxTemp] = {color: 'red'};
            this.gaugeTempThresholdConfig = gaugeTempThreshold;

            let coef = 0.000089;
            this.dest_lng1 = this.userthingy.endLongitude - coef * 2;
            this.dest_lng2 = this.userthingy.endLongitude + coef * 2;
            this.dest_lat1 = this.userthingy.endLatitude + coef / Math.cos(this.userthingy.endLatitude * 0.018);
            this.dest_lat2 = this.userthingy.endLatitude - coef / Math.cos(this.userthingy.endLatitude * 0.018);

        }
    }

    initThingyData(): void {
        let dates = this.getKeyOfThingData(this.thingyData, 'date', this.graphPoints);
        let accelX = this.getKeyOfThingData(this.thingyData, 'accelerometerX', this.graphPoints);
        let accelY = this.getKeyOfThingData(this.thingyData, 'accelerometerY', this.graphPoints);
        let accelZ = this.getKeyOfThingData(this.thingyData, 'accelerometerZ', this.graphPoints);
        let latitude = this.getKeyOfThingData(this.thingyData, 'latitude', this.thingyData.length);
        let longitude = this.getKeyOfThingData(this.thingyData, 'longitude', this.thingyData.length);
        let temp = this.getKeyOfThingData(this.thingyData, 'temperature', this.graphPoints);
        let pres = this.getKeyOfThingData(this.thingyData, 'pressure', this.graphPoints);
        let hum = this.getKeyOfThingData(this.thingyData, 'humidity', this.graphPoints);
        let eco2 = this.getKeyOfThingData(this.thingyData, 'eco2', this.graphPoints);

        // format date for y axis
        for (let date of dates) {
            let formatDate = new Date(date);
            this.lineChartLabels.push('' + formatDate.getHours()
                + ':' + formatDate.getMinutes()
                + ':' + formatDate.getSeconds());
        }

        let accelData = [
            { data: accelX, label: 'Acceleration X' },
            { data: accelY, label: 'Acceleration Y' },
            { data: accelZ, label: 'Acceleration Z' }
        ];
        let polyData = [];
        if (longitude.length === latitude.length) {
            while (longitude.length !== 0) {
                polyData.push({longitude: longitude.shift(), latitude: latitude.shift()});
            }
        }
        let tempData = [
            { data: temp, label: 'Temperature [°C]' }
        ];
        let presData = [
            { data: pres, label: 'Pressure [Pa]' }
        ];
        let humData = [
            { data: hum, label: 'Humidity [%]' }
        ];
        let eco2Data = [
            { data: eco2, label: 'Eco2' }
        ];
        this.accelChartData = accelData;
        this.tempChartData = tempData;
        this.presChartData = presData;
        this.humChartData = humData;
        this.eco2ChartData = eco2Data;
        this.polylineData = polyData;
    }

    refreshGraphs(): void {
        // only refresh if new data is available
        if (this.lastThingy && this.lastThingy.date !== this.lastThingyDate) {
            this.lastThingyDate = this.lastThingy.date;

            // format date for y axis
            let date = new Date(this.lastThingy.date);
            this.lineChartLabels.push('' + date.getHours()
                + ':' + date.getMinutes()
                + ':' + date.getSeconds());

            /***** linegraphs deep clone necessary, else the data won't update *****/

            // acceleration
            let accelClone = this.accelChartData.map(x => Object.assign({}, x));
            accelClone[0].data.push(this.lastThingy.accelerometerX);
            accelClone[1].data.push(this.lastThingy.accelerometerY);
            accelClone[2].data.push(this.lastThingy.accelerometerZ);
            this.accelChartData = accelClone;

            let polyClone = this.polylineData.map(x => Object.assign({}, x));
            polyClone.push({longitude: this.lastThingy.longitude, latitude: this.lastThingy.latitude});
            this.polylineData = polyClone;
            this.lngMarker = this.lastThingy.longitude;
            this.latMarker = this.lastThingy.latitude;

            let tempClone = this.tempChartData.map(x => Object.assign({}, x));
            tempClone[0].data.push(this.lastThingy.temperature);
            this.tempChartData = tempClone;

            let presClone = this.presChartData.map(x => Object.assign({}, x));
            presClone[0].data.push(this.lastThingy.pressure);
            this.presChartData = presClone;

            let humClone = this.humChartData.map(x => Object.assign({}, x));
            humClone[0].data.push(this.lastThingy.humidity);
            this.humChartData = humClone;

            let eco2Clone = this.eco2ChartData.map(x => Object.assign({}, x));
            eco2Clone[0].data.push(this.lastThingy.eco2);
            this.eco2ChartData = eco2Clone;

            // gauges
            this.gaugeTempValue = this.lastThingy.temperature;
            this.gaugePressValue = this.lastThingy.pressure;
            this.gaugeHumValue = this.lastThingy.humidity;
            this.gaugeEcoValue = this.lastThingy.eco2;

            // color
            let colorMax = Math.max(this.lastThingy.colorRed, this.lastThingy.colorGreen, this.lastThingy.colorBlue);

            this.rgbaColor = 'rgba('
                + Math.round(this.lastThingy.colorRed / colorMax * 255)
                + ','
                + Math.round(this.lastThingy.colorGreen / colorMax * 255)
                + ','
                + Math.round(this.lastThingy.colorBlue / colorMax * 255)
                + ','
                + 1
                + ')';


        }
    }

    RandomizeGauge(): void {
        // acceleration
        let cloned = this.accelChartData.map(x => Object.assign({}, x));
        cloned[0].data.push(this.lastThingy.accelerometerX);
        cloned[1].data.push(this.lastThingy.accelerometerY);
        cloned[2].data.push(this.lastThingy.accelerometerZ);
        this.accelChartData = cloned;

        let date = new Date(this.lastThingy.date);
        this.lineChartLabels.push('' + date.getHours()
            + ':' + date.getMinutes()
            + ':' + date.getSeconds());
    }

    refreshData(): void {
        if (this.user && this.user.userThingys) {
            let userthingyTemp;
            if (this.userthingyA) {
                userthingyTemp = this.userthingyA.thingyID;
            } else {
                userthingyTemp = this.user.userThingys[0];
            }
            this.thingyService.getThingyById(userthingyTemp).then(
                (thingyData: ThingyData[]) => {
                    console.log('before filter: ' + thingyData);
                    // filter empty date and position columns
                    thingyData = thingyData.filter(function(n){ return n.date != undefined });
                    thingyData = thingyData.filter(function(n){ return n.longitude != undefined });
                    thingyData = thingyData.filter(function(n){ return n.latitude != undefined });
                    console.log('after filter: ' + thingyData);
                    this.thingyData = thingyData;
                },
                error => {
                    this.snackbar.open('No thingy data available.', 'close', this.config);
                }).then(
                () => {
                    this.thingyService.getLastEntry(userthingyTemp).then(
                        (thingyData: ThingyData) => {
                            this.lastThingy = thingyData;
                            this.refreshGraphs();
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
            },
            error => {
                console.log('Something went wrong');
            }).then(
            () => {
                if (this.user.userThingys && !this.userthingyA) {
                    this.thingyService.getLastEntry(this.user.userThingys[0]).then(
                        (thingyData: ThingyData) => {
                            this.lastThingy = thingyData;
                            if(this.lastThingy){
                                this.lastThingyDate = this.lastThingy.date;
                                this.initLastThingyData();
                            }
                        },
                        error => {
                            console.log('Something went wrong');
                        });
                } else if (this.user.userThingys && this.userthingyA) {
                    this.thingyService.getLastEntry(this.userthingyA.thingyID).then(
                        (thingyData: ThingyData) => {
                            this.lastThingy = thingyData;
                            if(this.lastThingy){
                                this.lastThingyDate = this.lastThingy.date;
                                this.initLastThingyData();
                            }
                        },
                        error => {
                            console.log('Something went wrong');
                        });
                }
            }
        ).then(
            () => {
                if (this.user.userThingys && !this.userthingyA) {
                    this.thingyService.getThingyById(this.user.userThingys[0]).then(
                        (thingyData: ThingyData[]) => {
                            // filter empty date and position columns
                            thingyData = thingyData.filter(function(n){ return n.date != undefined });
                            thingyData = thingyData.filter(function(n){ return n.longitude != undefined });
                            thingyData = thingyData.filter(function(n){ return n.latitude != undefined });
                            this.thingyData = thingyData;
                            this.thingyData = thingyData;
                            this.initThingyData();
                            this.snackbar.open('Request successful', 'close', this.config);
                        },
                        error => {
                            console.log('Something went wrong');
                            this.snackbar.open('No thingy data available.', 'close', this.config);
                        });
                } else if(this.user.userThingys && this.userthingyA) {
                    this.thingyService.getThingyById(this.userthingyA.thingyID).then(
                        (thingyData: ThingyData[]) => {
                            // filter empty date and position columns
                            thingyData = thingyData.filter(function(n){ return n.date != undefined });
                            thingyData = thingyData.filter(function(n){ return n.longitude != undefined });
                            thingyData = thingyData.filter(function(n){ return n.latitude != undefined });
                            this.thingyData = thingyData;
                            this.initThingyData();
                            this.snackbar.open('Request successful', 'close', this.config);
                        },
                        error => {
                            console.log('Something went wrong');
                            this.snackbar.open('No thingy data available.', 'close', this.config);
                        });
                }
            }
        ).then(
            () => {
                if(this.user.userThingys && !this.userthingyA) {
                    this.userthingyService.getUserthingyById(this.user.userThingys[0]).then(
                        (userThingy: Userthingy) => {
                            this.userthingy = userThingy;
                            this.userthingyA = this.userthingy;
                            this.initUserthingyData();
                            this.refreshGraphs();
                        },
                        error => {
                            this.snackbar.open('Couldnt load userthingy');
                        });
                    this.userthingyService.getUserthingys().then(
                        (userThingys: Userthingy[]) => {
                            this.userthingys = userThingys;
                        },
                        error => {
                            this.snackbar.open('Couldnt load userthingy');
                        }
                    )
                } else if(this.user.userThingys && this.userthingyA) {
                    this.userthingy = this.userthingyA;
                    this.initUserthingyData();
                    this.refreshGraphs();
                }
            }
        );
    }


    randomNumberFromInterval(min: number, max: number): number {
        // returns a random number rounded to two decimals between min and max
        return Math.round((Math.random() * (max - min + 1) + min) * 100) / 100;
    }

    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }

    getKeyOfThingData(array: ThingyData[], key: string, elements: number) {
        return array.map(function(item) { return item[key]; }).splice(-elements);
    }

    changeUserthingy(userthingy: Userthingy) {
        console.log('changed to: ' + userthingy.thingyID);
        this.userthingy = userthingy;
        this.userthingyA = userthingy;
        this.getAllData();
    }

}
