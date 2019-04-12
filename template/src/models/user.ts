import { routerRedux } from 'dva/router';
import { reloadAuthorized } from '@/utils/Authorized';
import { removeAuthority } from '@/utils/routerUtils';
import * as api from '@/services/user';
import { catchError, retry } from '@/utils/decorators';

class Effects {
  /**
   * 切换身份
   */
  @catchError()
  *switchIdentity(action, { call, put }) {
    const { payload, callback } = action;
    yield call(api.switchIdentity, payload);
    reloadAuthorized();
    typeof callback === 'function' && callback();
    location.reload();
  }

  /**
   * 二维码生成
   */
  @catchError({
    errorActions: [
      { type: 'user/setQRData', payload: { qrToken: '' } },
      { type: 'user/changeQrStatus', payload: 1999 }
    ]
  })
  *fetchQRCode(action, { call, put }) {
    const { payload } = action;
    const { data } = yield call(api.QRCodeApi, payload);
    yield put({
      type: 'setQRData',
      payload: data,
    });
    yield put({ type: 'changeQrStatus', payload: 0 });
  }

  /**
   * 是否扫码
   */
  @catchError({ isLog: false })
  *checkCodeScaned(action, { call, put }) {
    const { payload } = action;
    const { data } = yield call(api.isCodeScanedApi, payload);
    const { code, } = data;
    if (code === 0) {
      reloadAuthorized();
      yield put(routerRedux.push('/'));
    } else {
      yield put({ type: 'changeQrStatus', payload: code });
    }
  }

  @catchError()
  * login(action, { call, put }) {
    const authId = localStorage.getItem('authId');
    const { payload } = action;
    if (authId && !(payload && payload.authId)) {
      payload.authId = authId;
    }

    yield call(api.login, payload);
    reloadAuthorized();
    return true;
  }

  @catchError()
  * logout(_, { call, put }) {
    yield call(api.logout);
    removeAuthority();
    reloadAuthorized();
    yield put(routerRedux.push('/user/login'));
  }

  @retry({ name: '用户信息', namespace: 'user' })
  * fetchUser({ payload }, { call, put }) {
    const { data: user } = yield call(api.getUserInfo, payload);
    yield put({
      type: 'setCurrentUser',
      payload: user,
    });
  }
}

export default {
  namespace: 'user',

  state: {
    currentUser: {},
    qrCode: '',
    qrToken: '',
    qrStatusCode: 0,
  },

  effects: { ...Effects.prototype },

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

    changeQrStatus(state, { payload }) {
      return {
        ...state,
        qrStatusCode: payload
      };
    }
  },
};
