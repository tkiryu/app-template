import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FormRoutingModule } from './form-routing.module';

import { IgxInputGroupModule, IgxButtonModule, IgxLayoutModule, IgxIconModule, IgxDatePickerModule, IgxSnackbarModule } from 'igniteui-angular';

import { FormPageComponent } from './pages/form-page/form-page.component';

@NgModule({
  declarations: [
    FormPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    IgxButtonModule,
    IgxDatePickerModule,
    IgxInputGroupModule,
    IgxIconModule,
    IgxLayoutModule,
    IgxSnackbarModule,

    FormRoutingModule
  ]
})
export class FormModule { }
