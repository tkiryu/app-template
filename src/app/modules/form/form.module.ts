import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FormRoutingModule } from './form-routing.module';

import { IgxInputGroupModule, IgxButtonModule, IgxLayoutModule, IgxIconModule, IgxDatePickerModule, IgxCardModule, IgxSelectModule, IgxListModule, IgxForOfModule, IgxProgressBarModule, IgxSnackbarModule } from 'igniteui-angular';

import { FormPageComponent } from './pages/form-page/form-page.component';

@NgModule({
  declarations: [
    FormPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    IgxButtonModule,
    IgxCardModule,
    IgxDatePickerModule,
    IgxForOfModule,
    IgxInputGroupModule,
    IgxIconModule,
    IgxLayoutModule,
    IgxListModule,
    IgxProgressBarModule,
    IgxSelectModule,
    IgxSnackbarModule,

    FormRoutingModule
  ],
  providers: [
    DatePipe
  ]
})
export class FormModule { }
