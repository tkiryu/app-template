import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AngularSplitModule } from 'angular-split';

import {
  changei18n,
  IgxGridModule,
  IgxExcelExporterService,
  IgxCsvExporterService,
  IgxOverlayService,
  IgxSnackbarModule,
  IgxSelectModule
} from 'igniteui-angular';
import { IgxResourceStringsJA } from 'igniteui-angular-i18n';
changei18n(IgxResourceStringsJA);

import { GridRoutingModule } from './grid-routing.module';
import { GridPageComponent } from './pages/grid-page/grid-page.component';
import { SearchBarComponent, GridComponent, ColumnSettingsComponent } from './components';
import { CopyDirective, PasteDirective, UndoRedoDirective, RangeRowSelectionDirective } from './directives';

@NgModule({
  declarations: [
    GridPageComponent,
    SearchBarComponent,
    GridComponent,
    ColumnSettingsComponent,
    CopyDirective,
    PasteDirective,
    UndoRedoDirective,
    RangeRowSelectionDirective
  ],
  entryComponents: [
    // IgxOverlayService を介して動的に追加するため
    ColumnSettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    GridRoutingModule,

    // TODO: remove when it is fixed;https://github.com/bertrandg/angular-split/issues/149
    AngularSplitModule.forChild(),

    IgxGridModule,
    IgxSnackbarModule,
    IgxSelectModule
  ],
  providers: [
    IgxExcelExporterService,
    IgxCsvExporterService,
    // https://stackoverflow.com/a/51831884https://stackoverflow.com/a/51831884
    IgxOverlayService
  ]
})
export class GridModule {}
