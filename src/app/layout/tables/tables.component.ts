import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { UserService} from '../../shared/services/index';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { User } from '../../shared/models/user';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.scss'],
    animations: [routerTransition()]
})
export class TablesComponent implements OnInit {
    newThingyForm: FormGroup;

    newThingyId;

    user: User = new User();

    constructor(private userService: UserService,
                private fb: FormBuilder,
                private snackbar: MatSnackBar,
                public router: Router) {
        this.createForm();
    }
    ngOnInit() {
        // alert settings
        let config = new MatSnackBarConfig();
        config.extraClasses = ['snackbar-design'];
        config.duration = 3000;

        // get user profile
        //this.user = JSON.parse(localStorage.getItem('user'));


        this.userService.getUser().then(
            data => {
                this.user = data;
            },
            error => {
                this.snackbar.open('Something went wrong. Please contact an admin', 'close', config);
                this.router.navigate(['/login']);
            });
    }

    createForm() {
        this.newThingyForm = this.fb.group({
            thingyId: ['', Validators.required],
        });
    }

    onAddThingy() {
        // alert settings
        let config = new MatSnackBarConfig();
        config.extraClasses = ['snackbar-design'];
        config.duration = 3000;

        this.user.thingysID.push(this.newThingyId);
        this.newThingyId = '';

        this.userService.updateUser(this.user).then(
            data => {
                const jsonData = JSON.parse(JSON.stringify(data));
                if (jsonData.success) {
                    this.snackbar.open('Thingy successfully added', 'close', config);
                    this.newThingyForm.reset();
                    // update User
                } else {
                    console.log('fail: ' + jsonData.msg);
                    this.snackbar.open(jsonData.msg, 'close', config);
                }
            },
            error => {
                console.log('Something went wrong');
                this.snackbar.open('Something went wrong. Please contact an admin', 'close', config);
                this.router.navigate(['/login']);
            });

    }
}
