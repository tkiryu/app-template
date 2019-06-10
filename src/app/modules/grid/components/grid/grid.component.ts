import { Component, ViewChild, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { IgxGridComponent, IGridToolbarExportEventArgs, IGridCellEventArgs, ISelectionEventArgs, IgxGridTransaction, IgxTransactionService, TransactionType } from 'igniteui-angular';

import { SearchCondition, SearchResult, ItemToChange, ChangeType } from '../../models';
import { ID_KEY } from '../../constant';
import { csvToJson, excelToJson } from 'src/app/shared/utils';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [{ provide: IgxGridTransaction, useClass: IgxTransactionService }],
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

  @Output() loadData = new EventEmitter<any[]>();

  @Output() changeData = new EventEmitter<ItemToChange[]>();

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

  get canDelete(): boolean {
    return this.grid.selectedRows().length > 0;
  }

  get canUndo(): boolean {
    return this.grid.transactions.canUndo;
  }

  get canRedo(): boolean {
    return this.grid.transactions.canRedo;
  }

  get canCommit(): boolean {
    return this.grid.transactions.getAggregatedChanges(false).length > 0;
  }

  acceptExtension = '';

  isLoadingFile = false;
  loadingFileName = '';

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

  onPasteData(pasteData: ItemToChange[]): void {
    pasteData.forEach(pasteItem => {
      this.grid.updateRow(pasteItem.value, pasteItem.id);
    });
  }

  onSelectFileType(event: ISelectionEventArgs, input: HTMLInputElement): void {
    this.acceptExtension = event.newSelection.value;
    input.accept = this.acceptExtension;
    input.click();
  }

  async onImportFromFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files.length !== 1) {
      alert('複数ファイルは読み込めません');
      return;
    }

    const file = input.files[0];

    this.isLoadingFile = true;
    this.loadingFileName = file.name;

    try {
      let data;
      switch (this.acceptExtension) {
        case '.xlsx': {
          data = await excelToJson(file);
          break;
        }
        case '.csv': {
          data = await csvToJson(file);
          break;
        }
      }
      this.loadData.emit(data);
    } catch (e) {
      alert(`読み込みに失敗しました: ${JSON.stringify(e, null, '  ')}`);
    }

    this.isLoadingFile = false;
    this.loadingFileName = '';
  }

  onDelete(): void {
    const rowIDs = this.grid.selectedRows();
    rowIDs.forEach(rowID => this.grid.deleteRow(rowID));
  }

  onUndo(): void {
    this.grid.transactions.undo();
  }

  onRedo(): void {
    this.grid.transactions.redo();
  }

  onCommit(): void {
    const changes = this.grid.transactions.getAggregatedChanges(false);
    const dataToChange: ItemToChange[] = changes.map(change => {
      let type;
      switch (change.type) {
        case TransactionType.ADD: {
          type = ChangeType.Add;
          break;
        }
        case TransactionType.UPDATE: {
          type = ChangeType.Update;
          break;
        }
        case TransactionType.DELETE: {
          type = ChangeType.Remove;
          break;
        }
      }
      return {
        id: change.id,
        value: change.newValue,
        type
      };
    });
    this.grid.transactions.clear();
    this.changeData.emit(dataToChange);
  }
}
