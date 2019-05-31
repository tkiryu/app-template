import { Injectable } from '@angular/core';
import { StoreConfig, EntityState, EntityStore } from '@datorama/akita';
import { ID_KEY } from '../../constant';
import { Item } from '../../models';

export interface GridState extends EntityState<Item> {
  ui: {
    columns: any[];
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'grid', idKey: ID_KEY, resettable: true })
export class GridStore extends EntityStore<GridState, any> {

  constructor() {
    super({ ui: { columns: [] } });
  }

}
