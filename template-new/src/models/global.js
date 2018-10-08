import { queryNotices, getMenusInfo, getShopInfo, switchUserShop } from '@/services/api';
import { getMenuData } from '@/utils/routerUtils';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    menus: [],
    shops: [],
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },

    /* 获取菜单 */
    *fetchMenu(_, { call, put }) {
      const menus = yield call(getMenusInfo);
      yield put({
        type: 'setMenu',
        payload: getMenuData(menus.data),
      });
    },

    /* 获取商铺列表 */
    *fetchShop({ payload }, { call, put }) {
      const shops = yield call(getShopInfo, payload);

      yield put({
        type: 'setShopList',
        payload: shops.data,
      });
    },
    /* 切换门店 */
    *switch({ payload }, { call, put }) {
      if (payload.shopId) {
        localStorage.setItem('shopId', payload.shopId);
      }

      yield call(switchUserShop, payload)

      // 重新请求
      yield put({ type: 'fetchMenu' })
      yield put({ type: 'fetchShop' })
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    setMenu (state, { payload }) {
      return {
        ...state,
        menus: payload,
      }
    },
    setShopList(state, { payload }) {
      return {
        ...state,
        shops: payload,
      }
    }
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
