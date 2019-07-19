import { Injectable } from '@angular/core';

import { SearchStore } from './search.store';
import { SearchCondition, SearchResult } from '../../models';

@Injectable({ providedIn: 'root' })
export class SearchService {

  constructor(private searchStore: SearchStore) {}

  updateSearchCondition(searchCondition: SearchCondition): void {
    this.searchStore.update({ searchCondition });
  }

  updateSearchResult(searchResult: SearchResult): void {
    this.searchStore.update({ searchResult });
  }

  reset(): void {
    this.searchStore.reset();
  }
}
