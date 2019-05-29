import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GridStore } from './grid.store';
import { typeOf } from 'src/app/shared/utils';
import { SearchCondition, SearchResult } from '../models';

@Injectable({ providedIn: 'root' })
export class GridService {
  private url = '/assets/data.json';

  constructor(private gridStore: GridStore, private http: HttpClient) {}

  async loadData() {
    this.gridStore.setLoading(true);
    try {
      const data = await this.http.get<any[]>(this.url).toPromise();
      const columns = this.getColumns(data[0]);
      this.gridStore.update({ data, columns });
      this.gridStore.setLoading(false);
    } catch (e) {
      this.gridStore.setError(e);
    }
  }

  updateData(data): void {
    console.log(data);
    // this.gridStore.update({ data })
  }

  updateSearchCondition(searchCondition: SearchCondition): void {
    this.gridStore.update({ searchCondition });
  }

  updateSearchResult(searchResult: SearchResult): void {
    this.gridStore.update({ searchResult });
  }

  private getColumns(item: any): any[] {
    return Object.entries(item).map(([key, value]) => {
      const dataType = typeOf(value);
      return {
        field: key,
        header: key.toUpperCase(),
        dataType,
      };
    });
  }
}
