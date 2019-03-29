import { routerRedux } from 'dva/router';
import { reloadAuthorized } from '@/utils/Authorized';
import { removeAuthority } from '@/utils/routerUtils';
import { message } from 'antd';
import * as api from '@/services/user';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
    qrCode: '',
    qrToken: '',
    showReload: false,
  },

  effects: {
    /**
     * 二维码生成
     */
    *fetchQRCode(action, { call, put }) {
      try {
        const { payload } = action;
        const { data } = yield call(api.QRCodeApi, payload);
        yield put({
          type: 'setQRData',
          payload: data,
        });
        yield put({ type: 'changeReload', payload: false });
      } catch (e) {
        yield put({ type: 'setQRData', payload: { qrToken: '' } });
        yield put({ type: 'changeReload', payload: true });
        message.error(e.message);
      }
    },

    /**
     * 是否扫码
     */
    *checkCodeScaned(action, { call, put }) {
      try {
        const { payload } = action;
        const { data } = yield call(api.isCodeScanedApi, payload);
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      } catch (e) {
        console.log('[扫码 error]', e.message);
      }
    },

    * login(action, { call, put }) {
      try {
        const authId = localStorage.getItem('authId');
        const { payload } = action;
        if (authId && !(payload && payload.authId)) {
          payload.authId = authId;
        }

        yield call(api.login, payload);
        reloadAuthorized();
        return true;
      } catch (e) {
        message.error(e.message);
      }
    },

    * logout(_, { call, put }) {
      try {
        yield call(api.logout);
        removeAuthority();
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      } catch (e) {
        message.error(e.message);
      }
    },

    * fetchUser({ payload }, { call, put }) {
      try {
        const { data: user } = yield call(api.getUserInfo, payload);
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
    setCurrentUser(state, { payload }) {
      return {
        ...state,
        currentUser: payload || {},
      };
    },

    setQRData(state, { payload }) {
      return {
        ...state,
        qrCode: payload.qrCode,
        qrToken: payload.qrToken
      };
    },

    changeReload(state, { payload }) {
      return {
        ...state,
        showReload: payload
      };
    }
  },
};
