import { Directive, AfterViewInit, OnDestroy, Host, Self, Output, EventEmitter, NgZone } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { IgxGridComponent } from 'igniteui-angular';
import { ItemToUpdate } from '../models';

@Directive({
  selector: '[appPaste]'
})
export class PasteDirective implements AfterViewInit, OnDestroy {

  @Output() pasteData = new EventEmitter<ItemToUpdate[]>();

  private destroy$ = new Subject<boolean>();

  constructor(private zone: NgZone, @Host() @Self() private grid: IgxGridComponent) { }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      fromEvent<ClipboardEvent>(document, 'paste')
        .pipe(takeUntil(this.destroy$))
        .subscribe(event => {
          const tbody = this.grid.tbody.nativeElement as HTMLElement;
          if (!tbody.contains(document.activeElement)) {
            return;
          }

          // デフォルトの貼り付け処理をキャンセルする
          event.preventDefault();

          // 選択範囲を取得
          const ranges = this.grid.getSelectedRanges();

          if (ranges.length !== 1) {
            alert('複数の範囲に対して貼り付けできません');
            return;
          }

          // コピーした文字列を、行xセルの二次元配列に変換
          const data: string[][] = event.clipboardData.getData('text')
            .trim()
            // 改行コードで分割し、行データの配列に変換
            .split(/\r?\n/)
            // タブで分割し、セルデータの配列に変換
            .map(row => row.split('\t'));

          const { columnStart, rowStart } = ranges[0];
          const rowEnd = rowStart + (data.length - 1);
          const columnEnd = (columnStart as number) + (data[0].length - 1);

          // 貼り付けた個所が分かるように範囲選択しておく
          this.grid.selectRange({
            rowStart,
            rowEnd,
            columnStart,
            columnEnd
          });

          const columnKeys = this.grid.visibleColumns
            // 貼り付け範囲内の列に絞り込み
            .filter((_, index) => columnStart <= index && index <= columnEnd)
            // カラムキーを取得
            .map(column => column.field);

          const updates = data.map(row => {
            return row.reduce((obj, cell, index) => {
              const columnKey = columnKeys[index];
              return {
                ...obj,
                [columnKey]: cell
              };
            }, {});
          });

          const primaryKey = this.grid.primaryKey;
          const pasteData: ItemToUpdate[] = this.grid.filteredSortedData
            // 貼り付け範囲内の行に絞り込み
            .filter((_, index) => rowStart <= index  && index <= rowEnd)
            // 貼り付けデータを作成
            .map((rowData, index) => {
              const id = rowData[primaryKey];
              return {
                id,
                update: updates[index]
              };
            });

          this.zone.run(() => this.pasteData.emit(pasteData));
        });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
