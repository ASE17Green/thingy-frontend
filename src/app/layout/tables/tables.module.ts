import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesComponent } from './tables.component';
import { TablesRoutingModule } from './tables-routing.module';
import { PageHeaderModule } from './../../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        TablesRoutingModule,
        PageHeaderModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [TablesComponent]
})
export class TablesModule { }
