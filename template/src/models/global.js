import { getMenusInfo, getShopInfo, switchUserAuth } from '@/services/api';
import { getMenuData } from '@/utils/routerUtils';
import { message } from 'antd';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    menus: [],
    shops: [],
  },

  effects: {
    /* 获取菜单 */
    *fetchMenu(_, { call, put }) {
      try {
        const { data: menus } = yield call(getMenusInfo);
        yield put({
          type: 'setMenu',
          payload: getMenuData(menus),
        });
      } catch (e) {
        message.error(e.message);
      }
    },

    /* 获取商铺列表 */
    *fetchShop({ payload }, { call, put }) {
      const { data: shops } = yield call(getShopInfo, payload);

      yield put({
        type: 'setShopList',
        payload: shops,
      });
    },
    /* 切换门店 */
    *switch({ payload }, { call, put }) {
      if (payload.key) {
        localStorage.setItem('authId', payload.key);
      }

      yield call(switchUserAuth, payload);

      window.location.reload();
    },
  },

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
    setShopList(state, { payload }) {
      return {
        ...state,
        shops: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
