import { Component, OnInit, Input, ChangeDetectionStrategy, ViewChild, Output, EventEmitter } from '@angular/core';

import { IgxGridComponent, IgxGridTransaction, IgxTransactionService } from 'igniteui-angular';

import { ColumnSetting, Column } from '../../../../models';

@Component({
  selector: 'app-column-settings',
  templateUrl: './column-settings.component.html',
  styleUrls: ['./column-settings.component.scss'],
  providers: [{ provide: IgxGridTransaction, useClass: IgxTransactionService }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnSettingsComponent {

  @Input() columnSettings: ColumnSetting[];

  @Output() cancel = new EventEmitter<void>();

  @Output() commit = new EventEmitter<Column[]>();

  dataTypes = [
    'string',
    'number',
    'date',
    'boolean'
  ];

  @ViewChild('grid', { static: true }) grid: IgxGridComponent;

  get canCommit(): boolean {
    return this.grid.transactions.getAggregatedChanges(false).length > 0;
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onCommit(): void {
    const changes = this.grid.transactions.getAggregatedChanges(true);
    const columns = this.columnSettings.map(columnSetting => {
      const change = changes.find(change => change.id === columnSetting.field);
      if (change) {
        columnSetting = change.newValue;
      }
      // sampleValue プロパティを除く
      const { sampleValue, ...rest } = columnSetting;
      return rest;
    });
    this.grid.transactions.clear();
    this.commit.emit(columns);
  }
}
