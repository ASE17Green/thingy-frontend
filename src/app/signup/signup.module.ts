import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';

import { MatSnackBarModule, MatSnackBarConfig } from '@angular/material';

@NgModule({
  imports: [
      CommonModule,
      SignupRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      MatSnackBarModule,

  ],
  declarations: [
      SignupComponent
  ]
})
export class SignupModule { }
