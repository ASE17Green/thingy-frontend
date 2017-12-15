import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { UserService, UserthingyService } from '../../shared/services/index';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { User, Userthingy } from '../../shared/models/index';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

declare const jQuery: any;

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.scss'],
    animations: [routerTransition()]
})
export class TablesComponent implements OnInit {
    config = new MatSnackBarConfig();

    newThingyForm: FormGroup;

    userthingy = new Userthingy();

    user: User = new User();

    public searchControl: FormControl;

    @ViewChild('search')
    public searchElementRef: ElementRef;

    latMap: number = 46.9480;
    lngMap: number = 7.4474;
    latMarker: number;
    lngMarker: number;

    constructor(private userService: UserService,
                private userthingyService: UserthingyService,
                private fb: FormBuilder,
                private snackbar: MatSnackBar,
                public router: Router,
                private mapsAPILoader: MapsAPILoader,
                private ngZone: NgZone) {
        this.createForm();
    }
    ngOnInit() {
        // alert settings
        this.config.extraClasses = ['snackbar-design'];
        this.config.duration = 3000;

        this.searchControl = new FormControl();

        this.setCurrentPosition();

        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['address']
            });
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    //set latitude, longitude and zoom
                    this.userthingy.endLatitude = this.latMap = this.latMarker = place.geometry.location.lat();
                    this.userthingy.endLongitude = this.lngMap = this.lngMarker = place.geometry.location.lng();
                });
            });
        });


        this.userService.getUser().then(
            data => {
                this.user = data;
                console.log('this.user: ' + this.user.userThingys);
            },
            error => {
                this.snackbar.open('Something went wrong. Please contact an admin', 'close', this.config);
                this.router.navigate(['/login']);
            });
    }

    createForm() {
        this.newThingyForm = this.fb.group({
            thingyID: ['', Validators.required],
            thingyMinTemperature: ['', Validators.required],
            thingyMaxTemperature: ['', Validators.required],
            endLatitude: ['', Validators.required],
            endLongitude: ['', Validators.required],
        });
    }

    onAddThingy() {
        this.userthingyService.addUserthingy(this.userthingy).then(
            data => {
                const jsonData = JSON.parse(JSON.stringify(data));
                if (jsonData.success === undefined) {
                    this.snackbar.open('Thingy successfully added', 'close', this.config);
                    this.newThingyForm.reset();
                } else {
                    this.snackbar.open(jsonData.msg, 'close', this.config);
                }

            },
            error => {
                console.log('Something went wrong');
                this.snackbar.open('Something went wrong. Please contact an admin', 'close', this.config);
                this.router.navigate(['/login']);
            }).then(
            () => {
                this.userService.getUser().then(
                    data => {
                        this.user = data;
                    },
                    error => {
                        this.snackbar.open('Something went wrong. Please contact an admin', 'close', this.config);
                        this.router.navigate(['/login']);
                    });
            }
        );

    }

    private setCurrentPosition() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.userthingy.endLatitude = this.latMap = this.latMarker = position.coords.latitude;
                this.userthingy.endLongitude = this.lngMap = this.lngMarker = position.coords.longitude;
            });
        }
    }

    placeMarker($event) {
        this.userthingy.endLatitude = this.latMarker = $event.coords.lat;
        this.userthingy.endLongitude = this.lngMarker = $event.coords.lng;
    }
}
