import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import {ThingyService} from './shared/services/thingy.service';
import {UserService} from './shared/services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material';

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
        MatSnackBarModule
    ],
    providers: [AuthGuard, UserService, ThingyService],
    bootstrap: [AppComponent],
    exports: [
        FormsModule,
        ReactiveFormsModule
    ]
})
export class AppModule {
}
