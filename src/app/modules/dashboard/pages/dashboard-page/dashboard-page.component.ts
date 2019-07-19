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
      let man = 0;
      let woman = 0;
      let twenties = 0;
      let thirties = 0;
      let fourties = 0;
      let fifties = 0;
      let A = 0;
      let B = 0;
      let AB = 0;
      let O = 0;
      for (const item of data) {
        item['Gender'] === '男' ? man++ : woman++;

        const age = item['Age']
        if (20 <= age && age < 30) twenties++;
        if (30 <= age && age < 40) thirties++;
        if (40 <= age && age < 50) fourties++;
        if (50 <= age && age < 60) fifties++;

        const bloodType = item['BloodType'];
        if (bloodType === 'A') A++;
        if (bloodType === 'B') B++;
        if (bloodType === 'AB') AB++;
        if (bloodType === 'O') O++;
      }

      this.genders = [
        { gender: 'Man', count: man },
        { gender: 'Woman', count: woman }
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
