import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { getPageQuery, getQueryString } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { /* checkAuthority, */ removeAuthority } from '@/utils/routerUtils';
import { geneLoginUrl, ERP_HOST } from '@/utils/http/utils';

import {
  login as userLogin,
  getUserInfo,
  logout as userLogout,
  register as userRegister,
  sendSms as userSendSms,
  resetPassword as userResetPassword,
} from '@/services/user';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *login(action, { call, put }) {
      // return
      const shopId = localStorage.getItem('shopId');
      if (shopId && !(action.payload && action.payload.shopId)) {
        action.payload.shopId = shopId;
      }

      try {
        yield call(userLogin, action.payload);
        reloadAuthorized();
        action.success();
        const query = getQueryString() || {};
        if (query && query.redirect) {
          if (/https?/.test(query.redirect)) {
            window.location.href = query.redirect
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

    /* 获取用户 */
    *fetchUser({ payload }, { call, put }) {  // eslint-disable-line
      const user = yield call(getUserInfo, payload);
      yield put({
        type: 'setCurrentUser',
        payload: user.data,
      });
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { call, put, select }) {
      const pathname = yield select(state => state.routing.location.pathname);

      try {
        yield call(userLogout);
        removeAuthority();
        reloadAuthorized();
      } finally {
        // there is no any loading state.
        if (window.location.host.includes(ERP_HOST)) {
          yield put(routerRedux.push(pathname ? `/user/login?redirect=${pathname}` : '/user/login'));
        } else {
          window.location.href = geneLoginUrl();
        }
      }
    },
  },

  reducers: {
    setCurrentUser (state, { payload }) {
      return {
        ...state,
        currentUser: payload || {},
      }
    }
  }
};
