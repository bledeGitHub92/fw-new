import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { common } from '@/interface/common';

type Action<T> = common.Action<T>;

export default {
  namespace: '',

  state: {
    locationList: [],
  } ,

  effects: {
  },

  reducers: {
  },
}
