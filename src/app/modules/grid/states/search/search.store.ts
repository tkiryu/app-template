import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { SearchCondition, SearchResult } from '../../models';

export interface SearchState {
  searchCondition: SearchCondition;
  searchResult: SearchResult;
}

export function createInitialState(): SearchState {
  return {
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
@StoreConfig({ name: 'search' })
export class SearchStore extends Store<SearchState> {

  constructor() {
    super(createInitialState());
  }

}

