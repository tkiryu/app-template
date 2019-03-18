import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localeJa from '@angular/common/locales/ja';
registerLocaleData(localeJa);

import { AngularSplitModule } from 'angular-split';
import { TreeModule } from 'angular-tree-component';

import { changei18n, IgxGridModule, IgxNavbarModule } from 'igniteui-angular';
import { IgxResourceStringsJA } from 'igniteui-angular-i18n';
changei18n(IgxResourceStringsJA);

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ContentComponent } from './shared/components/content/content.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,

    AngularSplitModule.forRoot(),
    TreeModule.forRoot(),

    IgxGridModule,
    IgxNavbarModule,

    AppRoutingModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ja-JP' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
