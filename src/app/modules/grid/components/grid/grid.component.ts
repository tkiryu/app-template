import { Component, ViewChild, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { IgxGridComponent, IGridToolbarExportEventArgs, IGridCellEventArgs, IGridEditEventArgs } from 'igniteui-angular';
import { GridSelectionRange } from 'igniteui-angular/lib/core/grid-selection';

import { SearchCondition, SearchResult } from '../../models';
import { PRIMARY_KEY } from '../../constant';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {
  @Input() isLoading: boolean;

  @Input() data: any[];

  @Input() columns: any[];

  @Input() hasNextHistory: boolean;

  @Input() hasPrevHistory: boolean;

  @Input() set searchCondition(value: SearchCondition) {
    this.search(value);
  }

  @Output() searchResult = new EventEmitter<SearchResult>();

  @Output() selectItem = new EventEmitter<any>();

  @Output() updateData = new EventEmitter<any[]>();

  @Output() undo = new EventEmitter<void>();

  @Output() redo = new EventEmitter<void>();

  @ViewChild('grid') grid: IgxGridComponent;

  primaryKey = PRIMARY_KEY;

  get toolbarTitle(): string {
    if (this.isLoading) {
      return '読み込み中';
    }
    let count = 0;
    if (this.grid.data && this.grid.data.length) {
      count = this.grid.data.length;
    }
    return `${count}件`;
  }

  constructor() { }

  calculateGridSizes(): void {
    // TODO: this is a workaround. remove when calculation will be OK.
    (this.grid as any).calculateGridSizes();
  }

  search({ searchText, caseSensitive, exactMatch, isSearchForward }: SearchCondition): void {
    let totalCount = 0;
    let activeCount = 0;

    if (searchText) {
      if (isSearchForward) {
        totalCount = this.grid.findNext(searchText, caseSensitive, exactMatch);
      } else {
        totalCount = this.grid.findPrev(searchText, caseSensitive, exactMatch);
      }
      activeCount = totalCount === 0 ? 0 : this.grid.lastSearchInfo.activeMatchIndex + 1;
    } else {
      this.grid.clearSearch();
    }

    this.searchResult.emit({
      totalCount,
      activeCount
    });
  }

  onToolbarExporting(event: IGridToolbarExportEventArgs): void {
    const selectedRows = this.grid.selectedRows();
    if (!selectedRows.length) {
      // デフォルトのエクスポート処理に任せる
      return;
    }

    // デフォルトのエクスポート処理はキャンセルし選択行のみをエクスポートする
    event.cancel = true;

    const data = this.grid.filteredSortedData;
    const dataCount = data.length;

    const dataToExport = [];
    for (let i = 0; i < dataCount; i++) {
      const item = data[i];
      const isSelected = selectedRows.indexOf(item) > -1;
      if (isSelected) {
        dataToExport.push(item);
      }
    }

    if (!dataToExport.length) {
      return;
    }

    event.exporter.exportData(dataToExport, event.options);
  }

  onDoubleClick(event: IGridCellEventArgs) {
    this.selectItem.emit(event.cell.rowData);
  }

  onCellEdit(event: IGridEditEventArgs): void {
    // igx-grid 内のデータ更新はキャンセルし
    event.cancel = true;
    this.grid.endEdit(false);

    // ストア経由でデータ更新をかける
    const primaryKey = event.rowID;
    // TODO: Feature request: add columnKey or cell instance to IGridEditEventArgs
    const columnKey = this.grid.visibleColumns[event.cellID.columnID].field;
    const update = {
      [columnKey]: event.newValue
    };

    this.updateData.emit([{
      primaryKey,
      update
    }]);
  }

  onUndo(): void {
    this.undo.emit();
  }

  onRedo(): void {
    this.redo.emit();
  }

  onPaste(data: string[][]): void {
    // 選択範囲を取得
    const ranges = this.grid.selectionService.ranges as GridSelectionRange[];

    if (ranges.length !== 1) {
      alert('複数の範囲に対して貼り付けできません');
      return;
    }

    const { columnStart, rowStart } = ranges[0];
    const rowEnd = rowStart + (data.length - 1);
    const columnEnd = (columnStart as number) + (data[0].length - 1);

    const keys = this.grid.visibleColumns
      // 貼り付け範囲内の列に絞り込み
      .filter((_, index) => columnStart <= index && index <= columnEnd)
      // カラムキーを取得
      .map(column => column.field);

    const updates = data.map(row => {
      return row.reduce((obj, cell, index) => {
        const key = keys[index];
        return {
          ...obj,
          [key]: cell
        };
      }, {});
    });

    const dataToUpdate = this.grid.filteredSortedData
      // 貼り付け範囲内の行に絞り込み
      .filter((_, index) => rowStart <= index  && index <= rowEnd)
      // 貼り付けデータを作成
      .map((rowData, index) => {
        const primaryKey = rowData[this.primaryKey];
        return {
          primaryKey,
          update: updates[index]
        };
      });

    this.updateData.emit(dataToUpdate);
  }

}
