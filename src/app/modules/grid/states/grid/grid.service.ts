import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { applyTransaction } from '@datorama/akita';

import * as uuid from 'uuid';

import { GridStore } from './grid.store';
import { ID_KEY } from '../../constant';
import { ItemToChange, ChangeType } from '../../models';
import { typeOf } from 'src/app/shared/utils';

@Injectable({ providedIn: 'root' })
export class GridService {
  private url = '/assets/data.json';

  constructor(private gridStore: GridStore, private http: HttpClient) {}

  loadData(): void {
    this.http.get<any[]>(this.url)
      .pipe(
        catchError(err => {
          this.gridStore.setError(err);
          return throwError(err);
        })
      )
      .subscribe(data => this.setData(data));
  }

  setData(data: any[]): void {
    const columns = this.getColumns(data[0]);

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

  private getColumns(item: any): any[] {
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
