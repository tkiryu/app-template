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
          // デフォルトのコピー処理をキャンセルする
          event.preventDefault();

          // 選択範囲を取得
          const ranges = this.grid.getSelectedRanges();

          if (ranges.length !== 1) {
            alert('複数の範囲はコピーできません');
            return;
          }

          const selectedData = this.grid.getSelectedData();

            // クリップボードにコピーできるように、選択範囲のデータを文字列に変換
          const copyData = selectedData
            // 選択範囲の値をタブで連結
            .map(rowData => Object.values(rowData).join('\t'))
            // タブで文字列連結された行データを、さらに改行コードで文字列連結
            .join('\n');

          event.clipboardData.setData('text/plain', copyData);

          this.zone.run(() => this.copyData.emit(copyData));
        });

      fromEvent<KeyboardEvent>(this.grid.nativeElement, 'keydown')
        .pipe(
          filter(event => event.ctrlKey && event.key === 'c' && !event.repeat),
          takeUntil(this.destroy$)
        )
        .subscribe(event => {
          // デフォルトのコピー処理をキャンセルする
          event.preventDefault();
          document.execCommand('copy');
        });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
