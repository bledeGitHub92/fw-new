import * as api from './api';
import { action, observable, computed, toJS } from 'mobx';
import { Toast } from 'antd-mobile-rn';
import { ListDataset, Pagination } from 'src/interfaces/page';
import { mergePagination } from 'utils/index';

export class FooStore {

}

export default new FooStore();
