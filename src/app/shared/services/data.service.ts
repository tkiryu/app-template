import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { typeOf } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = '/assets/data.json';

  private _data$ = new BehaviorSubject<any[]>([]);

  get data$() {
    return this._data$.asObservable();
  }

  get columns$() {
    return this._data$.pipe(
      filter(data => !!data.length),
      map(data => {
        return Object.entries(data[0]).map(([key, value], index) => {
          const dataType = typeOf(value);
          return {
            field: key,
            header: key.toUpperCase(),
            dataType,
            editable: true,
            filterable: true,
            groupable: true,
            hasSummary: true,
            movable: true,
            pinned: key.toLowerCase() === 'id',
            resizable: true,
            searchable: true,
            sortable: true,
          };
        });
      })
    );
  }

  constructor(private httpClient: HttpClient) { }

  async fetch() {
    const data = await this.httpClient.get<any[]>(this.url).toPromise();
    this._data$.next(data);
  }
}
