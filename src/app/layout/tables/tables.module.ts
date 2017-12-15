import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesComponent } from './tables.component';
import { TablesRoutingModule } from './tables-routing.module';
import { PageHeaderModule } from './../../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

@NgModule({
    imports: [
        CommonModule,
        TablesRoutingModule,
        PageHeaderModule,
        FormsModule,
        ReactiveFormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBXHTRKZIH4ObdF7hf8S3amZhi_l0qWb4U',
            libraries: ['places']
        })
    ],
    declarations: [TablesComponent]
})
export class TablesModule { }
