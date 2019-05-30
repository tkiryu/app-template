import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { SearchStore, SearchState } from './search.store';

@Injectable({ providedIn: 'root' })
export class SearchQuery extends Query<SearchState> {
  searchCondition$ = this.select(state => state.searchCondition);
  searchResult$ = this.select(state => state.searchResult);

  constructor(protected store: SearchStore) {
    super(store);
  }
}
