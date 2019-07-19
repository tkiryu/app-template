import { Component, ChangeDetectionStrategy, ViewChild, OnInit } from '@angular/core';
import { NavComponent } from './shared/components';
import { NavigationQuery } from './states/navigation';
import { GridService, GridQuery } from './states/grid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  // TODO: remove calculation of grid width will be OK.
  // https://github.com/IgniteUI/igniteui-angular/issues/4952
  get mainWidth(): string {
    const isOpening = this.navigationQuery.getValue().isOpening;
    const isClosing = this.navigationQuery.getValue().isClosing;
    if (isOpening && !isClosing) {
      return 'calc(100vw - 200px)';
    }
    if (!isOpening && isClosing) {
      return 'calc(100vw - 60px)';
    }
    return 'calc(100vw - 200px)';
  }

  @ViewChild('nav', { static: true }) nav: NavComponent;

  constructor(
    private navigationQuery: NavigationQuery,
    private gridQuery: GridQuery,
    private gridService: GridService
  ) {}

  ngOnInit() {
    const url = this.gridQuery.getValue().ui.url;
    this.gridService.loadDataFromUrl(url);
  }

  onChangeNavigationMode(): void {
    this.nav.toggleNavigation();
  }
}
