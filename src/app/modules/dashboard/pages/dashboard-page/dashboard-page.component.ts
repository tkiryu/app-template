import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { IgxBannerComponent } from 'igniteui-angular';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent implements OnInit {

  @ViewChild('banner', { static: false }) banner: IgxBannerComponent;

  constructor() { }

  ngOnInit() {
    // this.banner.open();
  }

}
