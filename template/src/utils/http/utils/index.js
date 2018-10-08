import { getRightEnv } from '../../utils';
import message from 'antd/lib/message';
import notification from 'antd/lib/notification';
import 'antd/lib/message/style/index.css';
import 'antd/lib/notification/style/index.css';

export const ERP_HOST = 'erp.feewee.cn'
export const ADMIN_URL = window.location.protocol + `//${getRightEnv()}${ERP_HOST}`;
export const LOGIN_URL = '/#/user/login';
export const ERP_UNAUTH = 40101;
export const WX_UNAUTH = 40102;
export const MEMBER_UNAUTH = 40103;
export const ERROR_MSG_MAP = {
  // on my mind, i recommend to use server response message to show not as following:
  // 40101: '未登录',      //ERP user
  // 40102: '微信未授权',  // wechat user
  // 40103: '您不是会员',  // member user

  401: '抱歉，您还未登录',
  403: '抱歉，您没有权限访问该页面',
  413: '抱歉，您上传文件太大',

  404: '服务器迷路了，未寻到这个地址',
  405: '服务器无法理解这个请求方法',
  500: '服务器开小差，这是一个问题',
  502: '网关服务器在跟你开玩笑呢',
  503: '服务器不可用，你在跟我开玩笑',
  504: '服务器过于拥挤，超时空穿越了',
};

export function getErrorMsg (data, status, statusText) {
  let msg = '';

  if (typeof data !== 'object') {
    msg = ERROR_MSG_MAP[status]
  } else {
    msg = data.result || data.message
  }

  return msg || statusText || 'Uncaught (in feewee/http)'
}

export function showErrorMsg(msg, description) {
  if (description) {
    // 采用 windows chrome 的推送布局 `bottomRight`
    notification.error(
      Object.assign({
        // placement: 'bottomRight',
        bottom: 50,
        duration: 3,
      }, {
        message: msg,
        description,
      })
    )
  } else {
    message.error(msg)
  }
}

/**
 * Generates login url with redirect
 * @param {String} queryString  `?a=b&c=d` default: `?redirect=${encodeURIComponent(window.location.href)}`
 * @return loginUrl
 */
export const geneLoginUrl = (queryString = `?redirect=${encodeURIComponent(window.location.href)}`) => {
  return `${ADMIN_URL}${LOGIN_URL}${queryString}`;
}

/**
 * 控制未授权的内容
 */
export function handleUnauthorized(status, data) {
  if (!data || typeof data !== 'object' || !('' + data.status)) return;
  let statusCode = data.status;

  showErrorMsg(getErrorMsg(data, status));

  if (statusCode === ERP_UNAUTH) {
    /* if (getRightEnv() === 'dev') {
      console.error('开发环境下，你还未登陆的提示！')
    } else { */
      window.location.href = geneLoginUrl();
    // }
  } else if (statusCode === WX_UNAUTH) {
    // ERP 中理论上而言不会涉及微信的修改
    // go2OAuth(true);
  } else if (statusCode === MEMBER_UNAUTH) {
    // 非会员的处理，ERP中理论上而言也不会涉及非会员的处理
    // loginConfirm(errMsg);
    window.location.href = geneLoginUrl();
  }
}
