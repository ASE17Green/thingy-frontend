import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { UserService, ThingyService, UserthingyService} from '../../shared/services/index';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ThingyData, Userthingy, User } from '../../shared/models/index'
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    animations: [routerTransition()]
})
export class FormComponent implements OnInit {
    user: User = new User();
    userthingyForm: FormGroup;
    userthingys: Userthingy[];

    public searchControl: FormControl;

    @ViewChild('search')
    public searchElementRef: ElementRef;

    maps = [];
    latMap: number = 46.9480;
    lngMap: number = 7.4474;
    latMarker: number = 46.9480;
    lngMarker: number = 7.4474;

    config = new MatSnackBarConfig();

    constructor(private userService: UserService,
                private userthingyService: UserthingyService,
                private fb: FormBuilder,
                private snackbar: MatSnackBar,
                public router: Router,
                private mapsAPILoader: MapsAPILoader,
                private ngZone: NgZone) {
        this.config.extraClasses = ['snackbar-design'];
        this.config.duration = 3000;

        this.createForm();
    }
    ngOnInit() {
        this.searchControl = new FormControl();

        //this.setCurrentPosition();

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
                    this.userthingys[0].endLatitude = this.latMap = this.latMarker = place.geometry.location.lat();
                    this.userthingys[0].endLongitude = this.lngMap = this.lngMarker = place.geometry.location.lng();
                });
            });
        });


        this.userService.getUser().then(
            (userData: User) => {
                this.user = userData;
            },
            error => {
                console.log('Something went wrong');
            }).then(
            () => {
                if (this.user.userThingys) {
                    for (let thingysID of this.user.userThingys) {
                        this.userthingyService.getUserthingyById(thingysID).then(
                            (userthingy: Userthingy) => {
                                if (this.userthingys) {
                                    this.userthingys.push(userthingy);
                                } else {
                                    this.userthingys = [userthingy];
                                }
                                this.latMap = this.latMarker = userthingy.endLatitude;
                                this.lngMap = this.lngMarker = userthingy.endLongitude;
                            },
                            error => {
                                console.log('Something went wrong');
                            });
                    }
                }
            }
        );
    }

    createForm() {
        this.userthingyForm = this.fb.group({
            thingyMinTemperature: ['', Validators.required],
            thingyMaxTemperature: ['', Validators.required],
            endLatitude: ['', Validators.required],
            endLongitude: ['', Validators.required],
        });
    }

    onSetIntervals() {
        for (let userthingy of this.userthingys) {
            this.userthingyService.updateUserthingy(userthingy).then(
                data => {
                    const jsonData = JSON.parse(JSON.stringify(data));
                    if (jsonData.success === undefined) {
                        this.snackbar.open('Thingy successfully updated', 'close', this.config);
                    } else {
                        this.snackbar.open(jsonData.msg, 'close', this.config);
                    }
                },
                error => {
                    this.snackbar.open('Something went wrong. Please contact an admin', 'close', this.config);
                    this.router.navigate(['/login']);
                });
        }


    }
}
