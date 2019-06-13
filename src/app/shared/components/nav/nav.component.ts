import { Component, ViewChild } from '@angular/core';
import { IgxNavigationDrawerComponent } from 'igniteui-angular';

import { NavigationService } from 'src/app/states/navigation';
import { NavigationMode } from 'src/app/states/navigation/navigation-mode.enum';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  pages = [
    { url: '/dashboard', icon: 'dashboard', name: 'Dashboard'},
    { url: '/grid', icon: 'grid_on', name: 'Grid'},
    { url: '/form', icon: 'input', name: 'Form'}
  ];

  @ViewChild('nav') nav: IgxNavigationDrawerComponent;

  constructor(private navigationService: NavigationService) { }

  toggleNavigation(): void {
    this.nav.toggle();
  }

  onOpening(): void {
    this.navigationService.opening();
  }

  onClosing(): void {
    this.navigationService.closing();
  }

  onOpened(): void {
    this.navigationService.changeNavigationMode(NavigationMode.normal);
  }

  onClosed(): void {
    this.navigationService.changeNavigationMode(NavigationMode.mini);
  }
}
