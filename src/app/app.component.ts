import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { NavComponent } from './shared/components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  @ViewChild('nav') nav: NavComponent;

  handleChangeNavigationMode(): void {
    this.nav.toggleNavigation();
  }
}
