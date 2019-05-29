import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { NavigationMode } from './navigation-mode.enum';

export interface NavigationState {
   mode: NavigationMode;
}

export function createInitialState(): NavigationState {
  return {
    mode: NavigationMode.normal
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'navigation' })
export class NavigationStore extends Store<NavigationState> {
  constructor() {
    super(createInitialState());
  }
}
