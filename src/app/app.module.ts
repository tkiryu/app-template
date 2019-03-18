import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localeJa from '@angular/common/locales/ja';
registerLocaleData(localeJa);

import { ServiceWorkerModule } from '@angular/service-worker';

import { AngularSplitModule } from 'angular-split';

import { IgxNavbarModule } from 'igniteui-angular';

import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';

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

    IgxNavbarModule,

    AppRoutingModule,

    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ja-JP' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
