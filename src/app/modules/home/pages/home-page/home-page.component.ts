import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ITreeOptions } from 'angular-tree-component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  nodes = [
    {
      id: 1,
      name: 'root1',
      hasChildren: true
    },
    {
      id: 4,
      name: 'root2',
      hasChildren: true
    }
  ];
  options: ITreeOptions = {
    getChildren: this.getChildren.bind(this),
    useVirtualScroll: true,
    nodeHeight: 23
  };

  asyncChildren = [
    {
      name: 'child1',
      hasChildren: true
    },
    {
      name: 'child2'
    }
  ];

  data: any[] = [];
  columns: any[] = [];

  constructor() {
    const data = Array.from({ length: 1 }).map((_, i) => {
      const num = i + 1;
      const item = { id: num };
      Array.from({ length: 99 }).forEach((__, j) => {
        let value;
        // string
        if (j % 4 === 0) value = `item${num}`;
        // number
        if (j % 4 === 1) value = num;
        // boolean
        if (j % 4 === 2) value = num % 2 === 0;
        // date
        if (j % 4 === 3) value = new Date(new Date().setDate(num));
        item[`column${j + 1}`] = value;
      });
      return item;
    });

    // 列定義の生成
    this.columns = Object.entries(data[0]).map(([key, value], index) => {
      const dataType = Object.prototype.toString
        .call(value)
        .slice(8, -1)
        .toLowerCase();
      return {
        field: key,
        header: key.toUpperCase(),
        dataType, // string/number/boolean/date のみをサポートします
        width: 100 + (index % 5) * 50,
        editable: true,
        filterable: true,
        groupable: true,
        hasSummary: true,
        movable: true,
        pinned: key === 'id',
        resizable: true,
        searchable: true,
        sortable: true,
      };
    });
  }

  getChildren(node: any) {
    const newNodes = this.asyncChildren.map(c => Object.assign({}, c));

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(newNodes), 500);
    });
  }

  handleActivate(event, tree) {
    this.data = Array.from({ length: 100 }).map((_, i) => {
      const num = i + 1;
      const item = { id: num };
      Array.from({ length: 99 }).forEach((__, j) => {
        let value;
        // string
        if (j % 4 === 0) value = `item${num}`;
        // number
        if (j % 4 === 1) value = num;
        // boolean
        if (j % 4 === 2) value = num % 2 === 0;
        // date
        if (j % 4 === 3) value = new Date(new Date().setDate(num));
        item[`column${j + 1}`] = value;
      });
      return item;
    });
  }
}
