import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularSplitModule } from 'angular-split';

import {
  changei18n,
  IgxGridModule,
  IgxListModule,
  IgxLayoutModule,
  IgxExcelExporterService,
  IgxCsvExporterService,
} from 'igniteui-angular';
import { IgxResourceStringsJA } from 'igniteui-angular-i18n';
changei18n(IgxResourceStringsJA);

import { GridRoutingModule } from './grid-routing.module';
import { GridPageComponent } from './pages/grid-page/grid-page.component';
import { SearchBarComponent, GridComponent, DetailComponent } from './components';
import { CopyPasteDirective, UndoRedoDirective } from './directives';

@NgModule({
  declarations: [
    GridPageComponent,
    SearchBarComponent,
    GridComponent,
    DetailComponent,
    CopyPasteDirective,
    UndoRedoDirective
  ],
  imports: [
    CommonModule,
    GridRoutingModule,

    // TODO: remove when it is fixed;https://github.com/bertrandg/angular-split/issues/149
    AngularSplitModule.forChild(),

    IgxGridModule,
    IgxListModule,
    IgxLayoutModule
  ],
  providers: [
    IgxExcelExporterService,
    IgxCsvExporterService
  ]
})
export class GridModule {}
