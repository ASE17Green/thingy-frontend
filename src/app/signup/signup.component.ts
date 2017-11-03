import { Component, OnInit, OnChanges } from '@angular/core';
import { routerTransition } from '../router.animations';
import { UserService} from '../shared/services/index';
import { User } from '../shared/models/user';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { AlertComponent } from '../layout/bs-component/components/index';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {

    userForm: FormGroup;

    user: User = new User();

    constructor(private userService: UserService,
                private fb: FormBuilder) {

        this.createForm();
    }

    ngOnInit() {
    }

    createForm() {
        this.userForm = this.fb.group({
            name: ['', Validators.required],
            password: ['', Validators.required],
            passwordRepeat: ['', Validators.required]
        }, {validator: this.matchingFields('password', 'passwordRepeat')});
    }

    matchingFields(fieldKey: string, fieldRepeatKey: string) {
        return (group: FormGroup) => {
            let fieldInput = group.controls[fieldKey];
            let fieldRepeatInput = group.controls[fieldRepeatKey];
            if (fieldInput.value !== fieldRepeatInput.value) {
                return fieldRepeatInput.setErrors({notEquivalent: true})
            }
        }
    }


    submit() {
        this.user.name = 'asdf';
        this.user.password = 'mypw';
        this.userService.createUser(this.user);
    }
}
