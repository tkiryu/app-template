import { Directive, AfterViewInit, OnDestroy, Output, EventEmitter, NgZone, Host, Self } from '@angular/core';

import { Subject, fromEvent } from 'rxjs';
import { filter, takeUntil, pairwise, map } from 'rxjs/operators';

import { IgxGridComponent } from 'igniteui-angular';

@Directive({
  selector: '[appRangeRowSelection]'
})
export class RangeRowSelectionDirective implements AfterViewInit, OnDestroy {
  private isShiftKeydown = false;

  private destroy$ = new Subject<boolean>();

  constructor(private zone: NgZone, @Host() @Self() private grid: IgxGridComponent) { }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(
          filter(event => event.key === 'Shift' && !event.repeat),
          takeUntil(this.destroy$)
        )
        .subscribe(event => {
          this.isShiftKeydown = true;
          this.grid.nativeElement.addEventListener('selectstart', this.preventSelectstart);
        });

      fromEvent<KeyboardEvent>(document, 'keyup')
        .pipe(
          filter(event => event.key === 'Shift' && !event.repeat),
          takeUntil(this.destroy$)
        )
        .subscribe(event => {
          this.isShiftKeydown = false;
          this.grid.nativeElement.removeEventListener('selectstart', this.preventSelectstart);
        });

      this.grid.onRowSelectionChange.asObservable()
        .pipe(
          // API経由（grid.selectRows をコール）だと、rowパラメーターがない状態で onRowSelectionChange イベントが発生するため
          // フィルターアウトしておく
          filter(args => !!args.row),
          map(args => args.row.dataRowIndex),
          pairwise(),
          takeUntil(this.destroy$)
        )
        .subscribe(([prevRowIndex, currRowIndex]) => {
          if (!this.isShiftKeydown) {
            return;
          }

          let startRowIndex = prevRowIndex;
          let endRowIndex = currRowIndex;

          if (startRowIndex > endRowIndex) {
            [startRowIndex, endRowIndex] = [endRowIndex, startRowIndex];
          }

          const primaryKey = this.grid.primaryKey;
          // TODO: いつか要修正　public API を使用していないので
          // フィルター・ソート・グルーピングされている状態のデータビューは
          // grid.verticalScrollContainer.igxForOf
          // からしか取得できない
          const rowIDsToSelect = this.grid.verticalScrollContainer.igxForOf
            .filter((row, index) => {
              return startRowIndex <= index && index <= endRowIndex;
            })
            .map(row => row[primaryKey])
            // igxForOf にはグループ行も含まれるため primaryKey に合致するプロパティが存在しない
            // そのため配列から null undefined を除く必要がある
            .filter(Boolean);

          this.zone.run(() => {
            // setTimeout をかまさないと選択状態が反映されない
            setTimeout(() => this.grid.selectRows(rowIDsToSelect));
          });
        });

    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private preventSelectstart = event => event.preventDefault();
}
