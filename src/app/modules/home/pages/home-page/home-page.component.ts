import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  direction = 'horizontal';
  directions = [
    {
      icon: 'border_horizontal',
      selected: true
    },
    {
      icon: 'border_vertical',
    },
  ];

  data = this.dataService.data$;
  columns = this.dataService.columns$;

  constructor(private dataService: DataService) {}

  search() {
    this.dataService.fetch();
  }

  changeDirection(event) {
    this.direction = event.index === 0 ? 'vertical' : 'horizontal';
  }
}
