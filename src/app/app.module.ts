import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, LOCALE_ID } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localeJa from '@angular/common/locales/ja';
registerLocaleData(localeJa);

import { ServiceWorkerModule } from '@angular/service-worker';

import { AngularSplitModule } from 'angular-split';

import {
  IgxAvatarModule,
  IgxNavbarModule,
  IgxNavigationDrawerModule,
  IgxIconModule,
  IgxLayoutModule,
  IgxToggleModule
} from 'igniteui-angular';

import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HeaderComponent, FooterComponent, NavComponent } from './shared/components';

// not used in production
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    HttpClientModule,

    AngularSplitModule.forRoot(),

    IgxAvatarModule,
    IgxIconModule,
    IgxNavbarModule,
    IgxNavigationDrawerModule,
    IgxLayoutModule,
    IgxToggleModule,

    AppRoutingModule,

    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

    environment.production ?
        [] :
        [ AkitaNgDevtools.forRoot(), AkitaNgRouterStoreModule.forRoot() ],
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ja-JP' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
