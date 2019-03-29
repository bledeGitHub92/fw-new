import { toJS } from 'mobx';

export function getDefaultPagingParams() {
  return { current: 1, pageSize: 10, lastPage: false };
}
