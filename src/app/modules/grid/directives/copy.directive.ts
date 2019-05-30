import { Directive, AfterViewInit, OnDestroy, Host, Self, Output, EventEmitter, NgZone } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { IgxGridComponent } from 'igniteui-angular';

@Directive({
  selector: '[appCopy]'
})
export class CopyDirective implements AfterViewInit, OnDestroy {

  @Output() copyData = new EventEmitter<string>();

  private destroy$ = new Subject<boolean>();

  constructor(private zone: NgZone, @Host() @Self() private grid: IgxGridComponent) { }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      fromEvent<ClipboardEvent>(document, 'copy')
        .pipe(takeUntil(this.destroy$))
        .subscribe(event => {
          const tbody = this.grid.tbody.nativeElement as HTMLElement;
          if (!tbody.contains(document.activeElement)) {
            return;
          }

          // デフォルトのコピー処理をキャンセルする
          event.preventDefault();

          // 選択範囲を取得
          const ranges = this.grid.getSelectedRanges();

          if (ranges.length !== 1) {
            alert('複数の範囲はコピーできません');
            return;
          }

          const { columnStart, columnEnd, rowStart, rowEnd } = ranges[0];

          const columnKeys = this.grid.visibleColumns
            // 選択範囲内の列に絞り込み
            .filter((_, index) => columnStart <= index && index <= columnEnd)
            // カラムキーを取得
            .map(column => column.field);

            // クリップボードにコピーできるように、選択範囲のデータを文字列に変換
          const copyData = this.grid.filteredSortedData
            // 選択範囲内の行に絞り込み
            .filter((_, index) => rowStart <= index  && index <= rowEnd)
            // 行データのうち選択範囲内の列の値のみを取得して、タブで文字列連結
            .map(rowData => columnKeys.map(columnKey => rowData[columnKey]).join('\t'))
            // タブで文字列連結された行データを、さらに改行コードで文字列連結
            .join('\n');

          event.clipboardData.setData('text/plain', copyData);

          this.zone.run(() => this.copyData.emit(copyData));
        });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
