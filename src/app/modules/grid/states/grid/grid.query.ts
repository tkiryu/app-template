import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { GridStore, GridState } from './grid.store';
import { Item } from '../../models';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GridQuery extends QueryEntity<GridState, Item> {
  data$ = this.selectAll().pipe(map(data => data.map(item => ({ ...item }))));
  columns$ = this.select(state => state.ui.columns.map(column => ({ ...column })));

  constructor(protected store: GridStore) {
    super(store);
  }
}
