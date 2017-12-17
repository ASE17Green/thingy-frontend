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
    userthingyA: Userthingy;

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

        this.userService.getUser().then(
            (userData: User) => {
                this.user = userData;
            },
            error => {
                console.log('Something went wrong');
            }).then(
            () => {
                if (this.user.userThingys && !this.userthingyA) {
                        this.userthingyService.getUserthingys().then(
                            (userthingys: Userthingy[]) => {
                                this.userthingys = userthingys;
                                this.latMap = this.latMarker = userthingys[0].endLatitude;
                                this.lngMap = this.lngMarker = userthingys[0].endLongitude;
                                this.userthingyA = userthingys[0];
                            },
                            error => {
                                console.log('Something went wrong');
                            });
                } else if (this.user.userThingys && this.userthingyA) {
                    this.latMap = this.latMarker = this.userthingyA.endLatitude;
                    this.lngMap = this.lngMarker = this.userthingyA.endLongitude;
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
        this.userthingyService.updateUserthingy(this.userthingyA).then(
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
    changeUserthingy(userthingy: Userthingy) {
        this.userthingyA = userthingy;
        this.ngOnInit();
    }
}
