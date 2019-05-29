import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  @Input() set item(item: any) {
    if (!item) {
      return;
    }
    this.entries = Object.entries(item).map(([key, value]) => ({ key, value }));
  }

  entries: { key: string, value: any }[];

  constructor() { }

  ngOnInit() {
  }



}
