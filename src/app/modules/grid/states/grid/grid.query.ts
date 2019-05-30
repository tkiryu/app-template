import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { GridStore, GridState } from './grid.store';
import { Item } from '../../models';

@Injectable({ providedIn: 'root' })
export class GridQuery extends QueryEntity<GridState, Item> {
  data$ = this.selectAll();
  columns$ = this.select(state => state.ui.columns);

  constructor(protected store: GridStore) {
    super(store);
  }
}
