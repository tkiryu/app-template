import { Directive, AfterViewInit, OnDestroy, NgZone, Host, Self } from '@angular/core';

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

          const idKey = this.grid.primaryKey;
          // TODO: いつか要修正　public API を使用していないので
          // フィルター・ソート・グルーピングされている状態のデータビューは
          // grid.verticalScrollContainer.igxForOf
          // からしか取得できない
          const rowIDsToSelect = this.grid.verticalScrollContainer.igxForOf
            // 選択範囲内の行に絞り込み
            // igxForOf にはグループ行も含まれるため idKey に合致するプロパティが存在しない場合はグループ行とみなしフィルターアウトする
            .filter((row, index) => {
              return (startRowIndex <= index && index <= endRowIndex) &&
                !!row[idKey];
            })
            .map(row => row[idKey]);

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
