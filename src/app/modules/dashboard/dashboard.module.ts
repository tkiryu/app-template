import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IgxCardModule, IgxIconModule, IgxSnackbarModule } from 'igniteui-angular';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';

@NgModule({
  declarations: [DashboardPageComponent],
  imports: [
    CommonModule,

    IgxCardModule,
    IgxIconModule,
    IgxSnackbarModule,

    DashboardRoutingModule,
  ]
})
export class DashboardModule { }
