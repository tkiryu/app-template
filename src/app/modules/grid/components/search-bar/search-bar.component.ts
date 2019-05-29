import { Component, NgZone, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectionStrategy, Input, AfterViewInit } from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { SearchCondition, SearchResult } from '../../models';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent implements AfterViewInit {

  @Input() condition: SearchCondition;

  @Input() result: SearchResult;

  @Output() search = new EventEmitter<SearchCondition>();

  @ViewChild('searchBox') searchBox: ElementRef;

  constructor(private zone: NgZone) { }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      const input$ = fromEvent(this.searchBox.nativeElement, 'input').pipe(debounceTime(200));
      // IME入力完了時
      const compositionend$ = fromEvent(this.searchBox.nativeElement, 'compositionend');
      merge(input$, compositionend$)
        .subscribe((event: any) => {
          // IME入力中はキャンセル
          if (event.isComposing) {
            return;
          }
          const searchText = (event.target as HTMLInputElement).value;
          this.search.emit({
            ...this.condition,
            searchText
          });
        });
    });
  }

  searchPrev(event: KeyboardEvent | MouseEvent): void {
    if (event instanceof KeyboardEvent) {
      event.preventDefault();
    }

    this.search.emit({
      ...this.condition,
      isSearchForward: false
    });
  }

  searchNext(event: KeyboardEvent | MouseEvent): void {
    if (event instanceof KeyboardEvent) {
      event.preventDefault();
    }

    this.search.emit({
      ...this.condition,
      isSearchForward: true
    });
  }

  toggleCaseSensitive(): void {
    this.search.emit({
      ...this.condition,
      caseSensitive: !this.condition.caseSensitive
    });
  }

  toggleExactMatch(): void {
    this.search.emit({
      ...this.condition,
      exactMatch: !this.condition.exactMatch
    });
  }

  clearSearch(): void {
    this.search.emit({
      ...this.condition,
      searchText: ''
    });
  }
}
