import { ID } from '@datorama/akita';
import { PRIMARY_KEY } from '../constant';

export interface Item {
  [PRIMARY_KEY]: ID;
}
