import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormRoutingModule } from './form-routing.module';

import { FormPageComponent } from './pages/form-page/form-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IgxInputGroupModule, IgxButtonModule, IgxLayoutModule, IgxIconModule, IgxDatePickerModule } from 'igniteui-angular';

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

    FormRoutingModule
  ]
})
export class FormModule { }
