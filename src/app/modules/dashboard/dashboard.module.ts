import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IgxCardModule, IgxIconModule, IgxSnackbarModule } from 'igniteui-angular';

import { IgxDataChartCoreModule } from 'igniteui-angular-charts/ES5/igx-data-chart-core-module';
import { IgxDataChartCategoryModule } from 'igniteui-angular-charts/ES5/igx-data-chart-category-module';
import { IgxDataChartAnnotationModule } from 'igniteui-angular-charts/ES5/igx-data-chart-annotation-module';
// import { IgxLegendModule } from 'igniteui-angular-charts/ES5/igx-legend-module';

import { IgxDoughnutChartModule } from 'igniteui-angular-charts/ES5/igx-doughnut-chart-module';
import { IgxPieChartModule } from 'igniteui-angular-charts/ES5/igx-pie-chart-module';
import { IgxItemLegendModule } from 'igniteui-angular-charts/ES5/igx-item-legend-module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';

@NgModule({
  declarations: [DashboardPageComponent],
  imports: [
    CommonModule,

    IgxCardModule,
    IgxIconModule,
    IgxSnackbarModule,

    IgxDataChartCoreModule,
    IgxDataChartCategoryModule,
    IgxDataChartAnnotationModule,
    IgxDoughnutChartModule,
    IgxPieChartModule,
    // IgxLegendModule,
    IgxItemLegendModule,

    DashboardRoutingModule,
  ]
})
export class DashboardModule { }
