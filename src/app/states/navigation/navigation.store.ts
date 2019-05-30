import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { NavigationMode } from './navigation-mode.enum';

export interface NavigationState {
   mode: NavigationMode;
   isOpening: boolean;
   isClosing: boolean;
}

export function createInitialState(): NavigationState {
  return {
    mode: NavigationMode.normal,
    isOpening: false,
    isClosing: false
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'navigation' })
export class NavigationStore extends Store<NavigationState> {
  constructor() {
    super(createInitialState());
  }
}
