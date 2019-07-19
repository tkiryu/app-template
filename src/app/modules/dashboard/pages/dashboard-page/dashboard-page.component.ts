import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { GridQuery } from 'src/app/states/grid';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent implements OnInit {
  ageGroups: any[];
  genders: any[];
  bloodTypes: any[];

  constructor(private gridQuery: GridQuery) { }

  ngOnInit() {
    this.gridQuery.data$.subscribe(data => {
      let male = 0;
      let female = 0;
      let twenties = 0;
      let thirties = 0;
      let fourties = 0;
      let fifties = 0;
      let A = 0;
      let B = 0;
      let AB = 0;
      let O = 0;
      for (const item of data) {
        item['性別'] === '男' ? male++ : female++;

        const age = item['年齢']
        if (20 <= age && age < 30) twenties++;
        if (30 <= age && age < 40) thirties++;
        if (40 <= age && age < 50) fourties++;
        if (50 <= age && age < 60) fifties++;

        const bloodType = item['血液型'];
        if (bloodType === 'A') A++;
        if (bloodType === 'B') B++;
        if (bloodType === 'AB') AB++;
        if (bloodType === 'O') O++;
      }

      this.genders = [
        { gender: 'Male', count: male },
        { gender: 'Female', count: female }
      ];

      this.ageGroups = [
        { ageGroup: 'Twenties', count: twenties },
        { ageGroup: 'Thirties', count: thirties },
        { ageGroup: 'Fourties', count: fourties },
        { ageGroup: 'Fifties', count: fifties }
      ];

      this.bloodTypes = [
        { bloodType: 'A', count: A },
        { bloodType: 'B', count: B },
        { bloodType: 'AB', count: AB },
        { bloodType: 'O', count: O }
      ];
    });
  }

}
