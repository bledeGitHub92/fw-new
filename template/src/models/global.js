import { getMenusInfo, getShopInfo, switchUserShop } from '@/services/api';
import { getMenuData } from '@/utils/routerUtils';

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
      const menus = yield call(getMenusInfo);
      yield put({
        type: 'setMenu',
        payload: getMenuData(menus),
      });
    },

    /* 获取商铺列表 */
    *fetchShop({ payload }, { call, put }) {
      const shops = yield call(getShopInfo, payload);

      yield put({
        type: 'setShopList',
        payload: shops,
      });
    },
    /* 切换门店 */
    *switch({ payload }, { call, put }) {
      if (payload.shopId) {
        localStorage.setItem('shopId', payload.shopId);
      }

      yield call(switchUserShop, payload);

      // 重新请求
      yield put({ type: 'fetchMenu' });
      yield put({ type: 'fetchShop' });
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