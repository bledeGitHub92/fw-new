import { routerRedux } from 'dva/router';
import { getQueryString } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { removeAuthority } from '@/utils/routerUtils';
import { geneLoginUrl, ERP_HOST } from '@/utils/http/utils';

import { login as userLogin, getUserInfo, logout as userLogout } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *login (action, { call, put }) {
      const shopId = localStorage.getItem('shopId');
      const { payload } = action;
      if (shopId && !(payload && payload.shopId)) {
        payload.shopId = shopId;
      }

      try {
        yield call(userLogin, payload);
        reloadAuthorized();
        action.success();
        const query = getQueryString() || {};
        if (query && query.redirect) {
          if (/https?/.test(query.redirect)) {
            window.location.href = query.redirect;
          } else {
            yield put(routerRedux.push(query.redirect));
          }
        } else {
          yield put(routerRedux.push('/admin/system'));
        }
      } catch (e) {
        action.error(e.message);
      }
    },

    *logout (_, { call, put, select }) {
      const pathname = yield select(state => state.routing.location.pathname);

      try {
        yield call(userLogout);
        removeAuthority();
        reloadAuthorized();
      } finally {
        if (window.location.host.includes(ERP_HOST)) {
          yield put(
            routerRedux.push(pathname ? `/user/login?redirect=${pathname}` : '/user/login')
          );
        } else {
          window.location.href = geneLoginUrl();
        }
      }
    },

    *fetchUser ({ payload }, { call, put }) {
      const { data: user } = yield call(getUserInfo, payload);
      yield put({
        type: 'setCurrentUser',
        payload: user,
      });
    },
  },

  reducers: {
    setCurrentUser (state, { payload }) {
      return {
        ...state,
        currentUser: payload || {},
      };
    },
  },
};
