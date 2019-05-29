import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { GridStore, GridState } from './grid.store';

@Injectable({ providedIn: 'root' })
export class GridQuery extends Query<GridState> {
  data$ = this.select(state => state.data);
  columns$ = this.select(state => state.columns);
  searchCondition$ = this.select(state => state.searchCondition);
  searchResult$ = this.select(state => state.searchResult);

  constructor(protected store: GridStore) {
    super(store);
  }
}
