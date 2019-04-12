import { getMenusInfo, getIdentityList, } from '@/services/api';
import { getMenuData } from '@/utils/routerUtils';
import { retry } from '@/utils/decorators';

class Effects {
  /**
   * 获取侧边栏
   */
  @retry({ name: '侧边栏菜单', namespace: 'global' })
  *fetchMenu(_, { call, put }) {
    const { data: menus } = yield call(getMenusInfo);
    yield put({
      type: 'setMenu',
      payload: getMenuData(menus),
    });
  }

  /**
   * 获取身份列表
   */
  @retry({ name: '身份列表', namespace: 'global' })
  *fetchIdentityList({ payload }, { call, put }) {
    const { data: identityList } = yield call(getIdentityList, payload);
    yield put({
      type: 'setIdentityList',
      payload: identityList,
    });
  }
}

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    menus: [],
    identityList: [],
  },

  effects: { ...Effects.prototype },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    setMenu(state, { payload }) {
      return {
        ...state,
        menus: payload,
      };
    },
    setIdentityList(state, { payload }) {
      return {
        ...state,
        identityList: Array.isArray(payload) ? payload : [],
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        // @ts-ignore
        if (typeof window.ga !== 'undefined') {
          // @ts-ignore
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
