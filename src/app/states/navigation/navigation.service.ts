import { Injectable } from '@angular/core';
import { NavigationStore } from './navigation.store';
import { NavigationMode } from './navigation-mode.enum';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

constructor(private navigationStore: NavigationStore) { }

  opening(): void {
    this.navigationStore.update({
      isOpening: true,
      isClosing: false
    });
  }

  closing(): void {
    this.navigationStore.update({
      isOpening: false,
      isClosing: true
    });
  }

  changeNavigationMode(mode: NavigationMode): void {
    this.navigationStore.update({ mode });
  }
}
