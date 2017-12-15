import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { ThingyService, UserthingyService, UserService } from './shared/services/index';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material';
import { NgxGaugeModule } from 'ngx-gauge';
import { AgmCoreModule } from '@agm/core';
import { Ng2OrderModule } from 'ng2-order-pipe';
import {NgxPaginationModule} from 'ngx-pagination';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
}
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        NgxGaugeModule,
        Ng2OrderModule,
        NgxPaginationModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBkEdBnh3t64muKZxcQS_04gOQYh4nRZCs'
        })
    ],
    providers: [AuthGuard, UserService, ThingyService, UserthingyService],
    bootstrap: [AppComponent],
    exports: [
        FormsModule,
        ReactiveFormsModule
    ]
})
export class AppModule {
}
