import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import { PageHeaderModule } from './../../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';


@NgModule({
    imports: [
        CommonModule,
        FormRoutingModule,
        PageHeaderModule,
        FormsModule,
        ReactiveFormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBXHTRKZIH4ObdF7hf8S3amZhi_l0qWb4U',
            libraries: ['places']
        })
    ],
    declarations: [FormComponent]
})
export class FormModule { }
