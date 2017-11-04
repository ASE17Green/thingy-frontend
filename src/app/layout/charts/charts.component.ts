import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ThingyService} from '../../shared/services/index';
import {ThingyData} from '../../shared/models/thingy-data';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    animations: [routerTransition()]
})
export class ChartsComponent implements OnInit {
    thingyData: ThingyData[];
    randomThingy = new ThingyData();

    lineTemp: any[] = [];
    lineLabels: any[] = [];

    // bar chart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    public barChartType = 'bar';
    public barChartLegend = true;

    public barChartData: any[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ];
    // Doughnut
    public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
    public doughnutChartData: number[] = [350, 450, 100];
    public doughnutChartType = 'doughnut';
    // Radar
    public radarChartLabels: string[] = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];
    public radarChartData: any = [
        { data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' },
        { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' }
    ];
    public radarChartType = 'radar';
    // Pie
    public pieChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
    public pieChartData: number[] = [300, 500, 100];
    public pieChartType = 'pie';
    // PolarArea
    public polarAreaChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
    public polarAreaChartData: number[] = [300, 500, 100, 40, 120];
    public polarAreaLegend = true;

    public polarAreaChartType = 'polarArea';


    // lineChart
    public lineChartData: Array<any> = [
        { data: [81, 42, 3, 94, 85, 76, 97], label: 'Temperature' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Gravity' },
        { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
    ];
    public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    public lineChartOptions: any = {
        responsive: true
    };
    public lineChartColors: Array<any> = [
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartLegend = true;
    public lineChartType = 'line';

    // events
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }

    public randomize(): void {
        // Only Change 3 values
        const data = [
            Math.round(Math.random() * 100),
            59,
            80,
            (Math.random() * 100),
            56,
            (Math.random() * 100),
            40
        ];
        const clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        this.barChartData = clone;
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
    }

    constructor(private thingyService: ThingyService,
                private snackbar: MatSnackBar) {
    }

    ngOnInit() {
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
