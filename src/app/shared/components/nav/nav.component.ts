import { Component, ViewChild } from '@angular/core';
import { NavigationService } from 'src/app/states/navigation';
import { IgxNavigationDrawerComponent } from 'igniteui-angular';
import { NavigationMode } from 'src/app/states/navigation/navigation-mode.enum';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  @ViewChild('nav') nav: IgxNavigationDrawerComponent;

  constructor(private navigationService: NavigationService) { }

  toggleNavigation(): void {
    this.nav.toggle();
  }

  handleOpened(event): void {
    this.navigationService.changeNavigationMode(NavigationMode.normal);
  }

  handleClosed(event): void {
    this.navigationService.changeNavigationMode(NavigationMode.mini);
  }
}
