import { Component, ViewChild, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { IgxGridComponent, IGridToolbarExportEventArgs, IGridCellEventArgs, IGridEditEventArgs } from 'igniteui-angular';

import { SearchCondition, SearchResult, ItemToUpdate } from '../../models';
import { ID_KEY } from '../../constant';

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

  @Output() updateData = new EventEmitter<ItemToUpdate[]>();

  @Output() undo = new EventEmitter<void>();

  @Output() redo = new EventEmitter<void>();

  @ViewChild('grid') grid: IgxGridComponent;

  primaryKey = ID_KEY;

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
    // https://github.com/IgniteUI/igniteui-angular/issues/4952
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
    // TODO: Feature request: add columnKey or cell instance to IGridEditEventArgs
    // https://github.com/IgniteUI/igniteui-angular/issues/4965
    const columnKey = this.grid.visibleColumns[event.cellID.columnID].field;

    const itemToUpdate: ItemToUpdate = {
      id: event.rowID,
      update: {
        [columnKey]: event.newValue
      }
    }

    this.updateData.emit([itemToUpdate]);
  }

  onUndo(): void {
    this.undo.emit();
  }

  onRedo(): void {
    this.redo.emit();
  }

  onPasteData(pasteData: ItemToUpdate[]): void {
    this.updateData.emit(pasteData);
  }
}
