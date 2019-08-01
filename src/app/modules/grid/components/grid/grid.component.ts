import { Component, ViewChild, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import {
  IgxGridComponent,
  IGridToolbarExportEventArgs,
  IgxGridTransaction,
  IgxTransactionService,
  TransactionType,
  IGridEditEventArgs
} from 'igniteui-angular';

import { SearchCondition, SearchResult } from '../../models';
import { ItemToChange, ChangeType } from '../../../../models';
import { ID_KEY } from '../../../../constant';
import { calculateAge } from '../../../../shared/utils';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [{ provide: IgxGridTransaction, useClass: IgxTransactionService }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit {
  @Input() isLoading: boolean;

  private _data: any[];
  @Input() set data(data: any[]) {
    this._data = data.map(rowData => {
      return {
        ...rowData,
        '生年月日': new Date(rowData['生年月日'])
      };
    });
  }
  get data(): any[] {
    return this._data;
  }

  @Input() set searchCondition(value: SearchCondition) {
    this.search(value);
  }

  @Output() searchResult = new EventEmitter<SearchResult>();

  @Output() selectItem = new EventEmitter<any>();

  @Output() changeData = new EventEmitter<ItemToChange[]>();

  @Output() showColumnSettings = new EventEmitter<void>();

  @ViewChild('grid', { static: true }) grid: IgxGridComponent;

  primaryKey = ID_KEY;

  columns: { field: string; dataType: string; editable?: boolean }[];

  get toolbarTitle(): string {
    if (this.isLoading) {
      return 'Loading...';
    }
    let count = 0;
    if (this.grid.data && this.grid.data.length) {
      count = this.grid.data.length;
    }
    return `${count} 件`;
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

  get canClear(): boolean {
    return this.grid.transactions.canUndo || this.grid.transactions.canRedo;
  }

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.columns = [
      { field: '連番', dataType: 'number' },
      { field: '姓', dataType: 'string', editable: true },
      { field: '名', dataType: 'string', editable: true },
      { field: '性別', dataType: 'string', editable: true },
      { field: '生年月日', dataType: 'date', editable: true },
      { field: '年齢', dataType: 'number' },
      { field: '血液型', dataType: 'number', editable: true },
      { field: '郵便番号', dataType: 'string', editable: true },
      { field: '住所', dataType: 'string', editable: true },
      { field: '携帯電話', dataType: 'string', editable: true },
      { field: 'メールアドレス', dataType: 'string', editable: true }
    ];
  }

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

  onCellEdit(event: IGridEditEventArgs): void {
    const field = this.grid.columns[event.cellID.columnID].field;
    if (field !== '生年月日') {
      return;
    }
    const age = calculateAge(event.newValue);
    this.grid.updateCell(age, event.rowID, '年齢');
  }

  onPasteData(pasteData: ItemToChange[]): void {
    pasteData.forEach(pasteItem => {
      this.grid.updateRow(pasteItem.value, pasteItem.id);
    });
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
      const date = change.newValue['生年月日'];
      change.newValue['生年月日'] = this.datePipe.transform(date, 'yyyy/MM/dd');
      return {
        id: change.id,
        value: change.newValue,
        type
      };
    });
    this.grid.transactions.clear();
    this.changeData.emit(dataToChange);
  }

  onClear(): void {
    this.grid.transactions.clear();
  }

  onColumnSettings(): void {
    this.showColumnSettings.emit();
  }
}
