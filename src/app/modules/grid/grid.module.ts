import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  changei18n,
  IgxGridModule,
  IgxExcelExporterService,
  IgxCsvExporterService,
  IgxOverlayService,
  IgxProgressBarModule,
  IgxSelectModule
} from 'igniteui-angular';
import { IgxResourceStringsJA } from 'igniteui-angular-i18n';
changei18n(IgxResourceStringsJA);

import { GridRoutingModule } from './grid-routing.module';
import { GridPageComponent } from './pages/grid-page/grid-page.component';
import { SearchBarComponent, GridComponent, ColumnSettingsComponent } from './components';
import { PasteDirective, UndoRedoDirective, RangeRowSelectionDirective } from './directives';
import { UrlInputComponent } from './components/url-input/url-input.component';

@NgModule({
  declarations: [
    GridPageComponent,
    SearchBarComponent,
    GridComponent,
    ColumnSettingsComponent,
    UrlInputComponent,
    PasteDirective,
    UndoRedoDirective,
    RangeRowSelectionDirective
  ],
  entryComponents: [
    // IgxOverlayService を介して動的に追加するため
    ColumnSettingsComponent,
    UrlInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    GridRoutingModule,

    IgxGridModule,
    IgxProgressBarModule,
    IgxSelectModule
  ],
  providers: [
    DatePipe,
    IgxExcelExporterService,
    IgxCsvExporterService,
    // https://stackoverflow.com/a/51831884https://stackoverflow.com/a/51831884
    IgxOverlayService
  ]
})
export class GridModule {}
