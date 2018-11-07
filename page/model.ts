import { EffectsCommandMap } from '_dva@2.4.1@dva';
import { message } from 'antd';
import { common } from '@/interface/common';

type Action<T> = common.Action<T>;

export default {
  namespace: 'location',

  state: {
    locationList: [],
  } ,

  effects: {
  },

  reducers: {
  },
}
