import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule as Ng2Charts } from 'ng2-charts';

import { ChartsRoutingModule } from './charts-routing.module';
import { ChartsComponent } from './charts.component';
import { PageHeaderModule } from '../../shared';
import { NgxGaugeModule } from 'ngx-gauge';
import { AgmCoreModule } from '@agm/core';
import { Ng2OrderModule } from 'ng2-order-pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        Ng2Charts,
        ChartsRoutingModule,
        PageHeaderModule,
        NgxGaugeModule,
        Ng2OrderModule,
        NgxPaginationModule,
        FormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBXHTRKZIH4ObdF7hf8S3amZhi_l0qWb4U'
        })
    ],
    declarations: [ChartsComponent]
})
export class ChartsModule { }
