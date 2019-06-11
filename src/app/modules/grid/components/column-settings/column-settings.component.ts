import { Component, OnInit, Input, ChangeDetectionStrategy, ViewChild, Output, EventEmitter } from '@angular/core';

import { IgxGridComponent, IGridEditEventArgs } from 'igniteui-angular';

import { ColumnSetting, Column } from '../../models';

@Component({
  selector: 'app-column-settings',
  templateUrl: './column-settings.component.html',
  styleUrls: ['./column-settings.component.scss'],
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

  @ViewChild('grid') grid: IgxGridComponent;

  onCancel(): void {
    this.cancel.emit();
  }

  onCommit(): void {
    const columns = this.columnSettings.map(columnSetting => {
      // sampleValue プロパティを除く
      const { sampleValue, ...rest } = columnSetting;
      return rest;
    });
    this.commit.emit(columns);
  }
}
