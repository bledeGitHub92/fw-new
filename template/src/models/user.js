import { routerRedux } from 'dva/router';
import { reloadAuthorized } from '@/utils/Authorized';
import { removeAuthority } from '@/utils/routerUtils';
import { message } from 'antd';
import { login as userLogin, getUserInfo, logout as userLogout } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    * login (action, { call, put }) {
      try {
        const authId = localStorage.getItem('authId');
        const { payload } = action;
        if (authId && !(payload && payload.authId)) {
          payload.authId = authId;
        }

        yield call(userLogin, payload);
        reloadAuthorized();
      } catch (e) {
        message.error(e.message);
      }
    },

    * logout (_, { call, put }) {
      try {
        yield call(userLogout);
        removeAuthority();
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      } catch (e) {
        message.error(e.message);
      }
    },

    * fetchUser ({ payload }, { call, put }) {
      try {
        const { data: user } = yield call(getUserInfo, payload);
        yield put({
          type: 'setCurrentUser',
          payload: user,
        });
      } catch (e) {
        message.error(e.message);
      }
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
