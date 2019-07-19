import { ID } from '@datorama/akita';

export enum ChangeType {
  Add = 'add',
  Update = 'update',
  Remove = 'remove'
}

export interface ItemToChange {
  id: ID;
  value: any;
  type: ChangeType;
}
