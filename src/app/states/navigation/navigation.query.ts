import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { NavigationStore, NavigationState } from './navigation.store';

@Injectable({ providedIn: 'root' })
export class NavigationQuery extends Query<NavigationState> {
  mode$ = this.select(state => state.mode);

  constructor(protected store: NavigationStore) {
    super(store);
  }
}
