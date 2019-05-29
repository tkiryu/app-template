import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { SearchCondition, SearchResult } from '../models';

export interface GridState {
  data: any[];
  columns: any[];
  searchCondition: SearchCondition;
  searchResult: SearchResult;
}

export function createInitialState(): GridState {
  return {
    data: [],
    columns: [],
    searchCondition: {
      searchText: '',
      caseSensitive: false,
      exactMatch: false,
      isSearchForward: true
    },
    searchResult: {
      totalCount: 0,
      activeCount: 0
    }
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'grid' })
export class GridStore extends Store<GridState> {

  constructor() {
    super(createInitialState());
  }

}

