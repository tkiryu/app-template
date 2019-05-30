import { Directive, AfterViewInit, OnDestroy, Host, Self, Output, EventEmitter, NgZone } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, filter, tap } from 'rxjs/operators';
import { IgxGridComponent } from 'igniteui-angular';
import { GridSelectionRange } from 'igniteui-angular/lib/core/grid-selection';

@Directive({
  selector: '[appCopyPaste]'
})
export class CopyPasteDirective implements AfterViewInit, OnDestroy {

  @Output() copy = new EventEmitter<string>();

  @Output() pasteFromExcel = new EventEmitter<string[][]>();

  private destroy$ = new Subject<boolean>();

  constructor(private zone: NgZone, @Host() @Self() private grid: IgxGridComponent) { }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.addCopyEventHandler();
      this.addPasteEventHandler();
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private addCopyEventHandler(): void {
    fromEvent<ClipboardEvent>(document, 'copy')
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        // デフォルトのコピー処理をキャンセルする
        event.preventDefault();

        // 選択範囲を取得
        const ranges = this.grid.selectionService.ranges as GridSelectionRange[];

        if (ranges.length !== 1) {
          alert('複数の範囲はコピーできません');
          return;
        }

        const { columnStart, columnEnd, rowStart, rowEnd } = ranges[0];

        const selectedColumnKeys = this.grid.visibleColumns
          // 選択範囲内の列に絞り込み
          .filter((_, index) => columnStart <= index && index <= columnEnd)
          // カラムキーを取得
          .map(column => column.field);

          // クリップボードにコピーできるように、選択範囲のデータを文字列に変換
        const copyData = this.grid.filteredSortedData
          // 選択範囲内の行に絞り込み
          .filter((_, index) => rowStart <= index  && index <= rowEnd)
          // 行データのうち選択範囲内の列の値のみを取得して、タブで文字列連結
          .map(rowData => selectedColumnKeys.map(columnKey => rowData[columnKey]).join('\t'))
          // タブで文字列連結された行データを、さらに改行コードで文字列連結
          .join('\n');

        event.clipboardData.setData('text/plain', copyData);

        this.copy.emit(copyData);
      });

    fromEvent<KeyboardEvent>(this.grid.nativeElement, 'keydown')
      .pipe(
        filter(event => event.ctrlKey && event.key === 'c' && !event.repeat),
        tap(event => console.log(event)),
        takeUntil(this.destroy$)
      )
      .subscribe(event => {
        // デフォルトのコピー処理をキャンセルする
        event.preventDefault();
        document.execCommand('copy');
      });
  }

  private addPasteEventHandler(): void {
    fromEvent<ClipboardEvent>(this.grid.nativeElement, 'paste')
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        // 選択範囲を取得
        const ranges = this.grid.selectionService.ranges as GridSelectionRange[];

        if (ranges.length !== 1) {
          alert('複数の範囲に対して貼り付けできません');
          return;
        }

        const data = event.clipboardData.getData('text').trim();

        // コピーした文字列を、行xセルの二次元配列に変換
        const pasteData: string[][] = data
          // 改行コードで分割し、行データの配列に変換
          .split(/\r?\n/)
          // タブで分割し、セルデータの配列に変換
          .map(row => row.split('\t'));

        this.zone.run(() => {
          this.pasteFromExcel.emit(pasteData);
        });
      });
  }
}
