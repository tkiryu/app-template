import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularSplitModule } from 'angular-split';

import {
  changei18n,
  IgxGridModule,
  IgxExcelExporterService,
  IgxCsvExporterService,
  IgxProgressBarModule,
  IgxSnackbarModule
} from 'igniteui-angular';
import { IgxResourceStringsJA } from 'igniteui-angular-i18n';
changei18n(IgxResourceStringsJA);

import { GridRoutingModule } from './grid-routing.module';
import { GridPageComponent } from './pages/grid-page/grid-page.component';
import { SearchBarComponent, GridComponent } from './components';
import { CopyDirective, PasteDirective, UndoRedoDirective, RangeRowSelectionDirective } from './directives';

@NgModule({
  declarations: [
    GridPageComponent,
    SearchBarComponent,
    GridComponent,
    CopyDirective,
    PasteDirective,
    UndoRedoDirective,
    RangeRowSelectionDirective
  ],
  imports: [
    CommonModule,
    GridRoutingModule,

    // TODO: remove when it is fixed;https://github.com/bertrandg/angular-split/issues/149
    AngularSplitModule.forChild(),

    IgxGridModule,
    IgxProgressBarModule,
    IgxSnackbarModule
  ],
  providers: [
    IgxExcelExporterService,
    IgxCsvExporterService
  ]
})
export class GridModule {}
