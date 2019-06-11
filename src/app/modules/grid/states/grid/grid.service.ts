import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { applyTransaction } from '@datorama/akita';

import * as uuid from 'uuid';

import { GridStore } from './grid.store';
import { ID_KEY } from '../../constant';
import { ItemToChange, ChangeType, Column } from '../../models';
import { typeOf } from 'src/app/shared/utils';

@Injectable({ providedIn: 'root' })
export class GridService {
  private url = '/assets/data.json';

  constructor(private gridStore: GridStore, private http: HttpClient) {}

  loadData(urlOrData?: string | any[]): void {
    if (Array.isArray(urlOrData)) {
      this.setData(urlOrData);
      return;
    }

    let url = urlOrData as string;
    if (!url) {
      url = this.url;
    }

    this.http.get<any[]>(url)
      .pipe(
        catchError(err => {
          this.gridStore.setError(err);
          return throwError(err);
        })
      )
      .subscribe(data => this.setData(data));
  }

  changeData(dataToChange: ItemToChange[]): void {
    applyTransaction(() => {
      dataToChange.forEach(item => {
        switch (item.type) {
          case ChangeType.Add: {
            this.gridStore.add(item.value);
            break;
          }

          case ChangeType.Update: {
            this.gridStore.update(item.id, item.value);
            break;
          }

          case ChangeType.Remove: {
            this.gridStore.remove(item.id);
            break;
          }
        }
      });
    });
  }

  removeData(): void {
    this.gridStore.reset();
  }

  changeDataTypes(data: any[], columns: Column[]): void {
    const newData = data.map(item => {
      // TODO: データのタイプを変更する
      return columns.reduce((obj, column) => {
        const fromValue = item[column.field];
        const fromType = typeOf(fromValue);
        const toType = column.dataType;

        if (fromType === toType) {
          obj[column.field] = fromValue;
          return obj;
        }

        let toValue;
        // https://www.w3schools.com/js/js_type_conversion.asp
        if (toType === 'string') {
          if (fromType === 'date') {
            toValue = new Intl.DateTimeFormat('ja-JP').format(fromValue);
          } else {
            // https://qiita.com/shimo_513/items/7d143432f0e1d9619ef9#6%E6%96%87%E5%AD%97%E5%88%97%E3%81%AB%E5%A4%89%E6%8F%9B%E3%81%99%E3%82%8B
            toValue = toValue + '';
          }
        } else if (toType === 'number') {
          toValue = Number(toValue);
        } else if (toType === 'date') {
          toValue = new Date(fromValue);
        } else if (toType === 'boolean') {
          // https://stackoverflow.com/a/31155542
          toValue = fromValue === 'false' ? false : Boolean(fromValue);
        }

        obj[column.field] = toValue;
        return obj;
      }, { [ID_KEY]: item[ID_KEY] });
    });
    applyTransaction(() => {
      this.gridStore.set(newData);
      this.gridStore.update({ ui: { columns } });
    });
  }

  private setData(data: any[]): void {
    const columns = this.generateColumns(data[0]);

    const dataWithId = data.map(rowData => {
      return {
        [ID_KEY]: uuid.v4(),
        ...rowData
      };
    });

    applyTransaction(() => {
      this.gridStore.set(dataWithId);
      this.gridStore.update({ ui: { columns } });
    });
  }

  private generateColumns(item: any): Column[] {
    return Object.entries(item).map(([key, value]) => {
      const dataType = typeOf(value);
      return {
        field: key,
        header: key,
        dataType,
      };
    });
  }
}
